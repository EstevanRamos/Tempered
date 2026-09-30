# Windows counterpart of dev.sh: starts PostgreSQL, the Vendure Engine (:3001) and the Svelte
# Commerce Storefront (:3000). Logs go to .dev\*.log. Safe to re-run: anything already up is left alone.
#
#   scripts\dev.ps1          start everything (first run sets up Postgres and loads the catalogue)
#   scripts\dev.ps1 stop     stop the Storefront, the Engine and Postgres
#
# No Postgres install needed: the first run downloads portable PostgreSQL 16 binaries into .dev\pg.
param([string]$Command = 'start')

$Root = Split-Path -Parent $PSScriptRoot
$Run = Join-Path $Root '.dev'
$PgDir = Join-Path $Run 'pg'
$PgBin = Join-Path $PgDir 'node_modules\@embedded-postgres\windows-x64\native\bin'
$PgData = Join-Path $PgDir 'data'
$PgPackage = '@embedded-postgres/windows-x64@16.14.0-beta.17'

$DbUrl = if ($env:DATABASE_URL) { $env:DATABASE_URL } else { 'postgres://vendure:vendure@127.0.0.1:5432/vendure' }
$EngineUrl = 'http://127.0.0.1:3001'
$StorefrontUrl = 'http://127.0.0.1:3000'
New-Item -ItemType Directory -Force $Run | Out-Null

function Test-Port([int]$Port) {
  $client = New-Object System.Net.Sockets.TcpClient
  try { $client.Connect('127.0.0.1', $Port); return $true } catch { return $false } finally { $client.Close() }
}

function Test-Url([string]$Url) {
  try { Invoke-WebRequest -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop $Url | Out-Null; return $true } catch { return $false }
}

function Wait-For([scriptblock]$Check, [int]$Seconds) {
  for ($i = 0; $i -lt $Seconds; $i++) { if (& $Check) { return $true }; Start-Sleep 1 }
  return $false
}

# Runs one SQL statement with Vendure's own pg client (the portable Postgres ships without psql).
# Prints the first column of the first row, or "ERR:<code>" on failure.
function Invoke-Sql([string]$Url, [string]$Sql) {
  $env:SQL_URL = $Url; $env:SQL_TEXT = $Sql
  $js = "const {Client}=require('pg');const c=new Client(process.env.SQL_URL);" +
        "c.connect().then(()=>c.query(process.env.SQL_TEXT)).then(r=>{const row=r.rows[0];" +
        "console.log(row?Object.values(row)[0]:'')}).catch(e=>console.log('ERR:'+e.code)).finally(()=>c.end())"
  Push-Location (Join-Path $Root 'vendure')
  try { return (& node -e $js | Out-String).Trim() } finally { Pop-Location }
}

# Runs node in $Dir, logging to .dev\<name>.log and .dev\<name>.err.log. Start-Process keeps native
# stderr out of PowerShell's error stream. -Wait runs it to completion and returns the exit code;
# otherwise it's left in the background with its PID recorded for `stop`.
function Start-Node([string]$Name, [string]$Dir, [string[]]$NodeArgs, [switch]$Wait) {
  $p = Start-Process node -ArgumentList $NodeArgs -WorkingDirectory $Dir -WindowStyle Hidden -PassThru `
    -RedirectStandardOutput (Join-Path $Run "$Name.log") -RedirectStandardError (Join-Path $Run "$Name.err.log")
  # Touching .Handle up front is what makes PowerShell 5.1 report ExitCode afterwards.
  if ($Wait) { $null = $p.Handle; $p.WaitForExit(); return $p.ExitCode }
  Set-Content -Encoding ascii (Join-Path $Run "$Name.pid") $p.Id
}

if ($Command -eq 'stop') {
  foreach ($name in 'storefront', 'vendure') {
    $pidFile = Join-Path $Run "$name.pid"
    if (Test-Path $pidFile) {
      # /T takes down the whole tree (ts-node, vite and their children).
      & taskkill /PID (Get-Content $pidFile) /T /F 2>$null | Out-Null
      Remove-Item $pidFile
    }
  }
  # The PID files miss servers whose launcher already exited (orphaned children) or that were started
  # some other way, so also kill whichever node process still holds the Engine or Storefront port.
  foreach ($port in 3000, 3001) {
    $owners = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue |
      Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($owner in $owners) {
      $proc = Get-Process -Id $owner -ErrorAction SilentlyContinue
      if ($proc -and $proc.ProcessName -eq 'node') {
        & taskkill /PID $owner /T /F 2>$null | Out-Null
        "killed node (PID $owner) on :$port"
      } elseif ($proc) {
        "left :$port alone: it is held by $($proc.ProcessName) (PID $owner), not node"
      }
    }
  }
  if ((Test-Path $PgData) -and (Test-Port 5432)) { & "$PgBin\pg_ctl.exe" -D $PgData stop -m fast | Out-Null }
  foreach ($port in 3000, 3001, 5432) { if (Test-Port $port) { "warning: :$port is still in use" } }
  'stopped'; exit 0
}

# PostgreSQL: fetch portable binaries and create the cluster once, then start it.
if (-not (Test-Port 5432)) {
  if (-not (Test-Path "$PgBin\pg_ctl.exe")) {
    'downloading portable PostgreSQL into .dev\pg'
    New-Item -ItemType Directory -Force $PgDir | Out-Null
    Push-Location $PgDir
    try {
      if (-not (Test-Path package.json)) { & npm init -y | Out-Null }
      & npm install $PgPackage --no-audit --no-fund
    } finally { Pop-Location }
  }
  if (-not (Test-Path $PgData)) {
    'creating the Postgres cluster'
    $pwFile = Join-Path $PgDir 'pw.txt'
    Set-Content -Encoding ascii $pwFile 'vendure'
    & "$PgBin\initdb.exe" -D $PgData -U vendure --pwfile=$pwFile -A md5 -E UTF8 | Out-Null
  }
  # Start-Process so pg_ctl's server doesn't hold this console open.
  Start-Process "$PgBin\pg_ctl.exe" -WindowStyle Hidden -ArgumentList @(
    '-D', "`"$PgData`"", '-l', "`"$PgDir\pg.log`"", '-o', '"-p 5432 -h 127.0.0.1"', 'start')
  if (-not (Wait-For { Test-Port 5432 } 30)) { "postgres did not start; see $PgDir\pg.log"; exit 1 }
}
'postgres    127.0.0.1:5432'

# Vendure Engine.
$vendure = Join-Path $Root 'vendure'
Push-Location $vendure
try {
  if (-not (Test-Path node_modules)) { & npm ci --no-audit --no-fund }
  if ((Invoke-Sql $DbUrl 'select 1') -eq 'ERR:3D000') {
    'creating the vendure database'
    $adminUrl = $DbUrl -replace '/[^/]+$', '/postgres'
    Invoke-Sql $adminUrl 'CREATE DATABASE vendure' | Out-Null
  }
  if (-not (Test-Path dist\dashboard\index.html)) {
    'building the Vendure dashboard'
    if ((Start-Node 'dashboard-build' $vendure @('node_modules\vite\bin\vite.js', 'build') -Wait) -ne 0) {
      "dashboard build failed; see $Run\dashboard-build.err.log"; exit 1
    }
  }
} finally { Pop-Location }

$env:DATABASE_URL = $DbUrl; $env:STOREFRONT_URL = $StorefrontUrl; $env:VENDURE_DISABLE_TELEMETRY = 'true'
if (-not (Test-Url "$EngineUrl/health")) {
  # First run: migrate and load the catalogue before the server starts.
  $products = Invoke-Sql $DbUrl 'select count(*) from product'
  if ($products -eq '0' -or $products -like 'ERR:*') {
    'loading the catalogue into Vendure'
    if ((Start-Node 'catalogue' $vendure @('node_modules\ts-node\dist\bin.js', 'src\import-catalogue.ts') -Wait) -ne 0) {
      "catalogue import failed; see $Run\catalogue.err.log"; exit 1
    }
  }
  Start-Node 'vendure' $vendure @('node_modules\ts-node\dist\bin.js', 'src\index.ts')
  if (-not (Wait-For { Test-Url "$EngineUrl/health" } 120)) { "vendure did not start; see $Run\vendure.log"; exit 1 }
}
"vendure     $EngineUrl/dashboard  (sign in superadmin / superadmin)"

# Svelte Commerce Storefront.
$storefront = Join-Path $Root 'svelte-commerce'
Push-Location $storefront
try {
  if (-not (Test-Path .env)) { Copy-Item .env.example .env }
  if (-not (Select-String -Quiet -Pattern '^\s*PUBLIC_VENDURE_API_URL=' .env)) {
    'warning: svelte-commerce\.env has no PUBLIC_VENDURE_API_URL; the Storefront will not reach Vendure'
  }
  if (-not (Test-Path node_modules)) {
    if (Get-Command bun -ErrorAction SilentlyContinue) { & bun install } else { & npm install --no-audit --no-fund }
  }
} finally { Pop-Location }

if (-not (Test-Url "$StorefrontUrl/health")) {
  Start-Node 'storefront' $storefront @('node_modules\vite\bin\vite.js', 'dev', '--host', '127.0.0.1')
  if (-not (Wait-For { Test-Url "$StorefrontUrl/health" } 60)) { "storefront did not start; see $Run\storefront.log"; exit 1 }
}
"storefront  $StorefrontUrl"
