#!/usr/bin/env bash
# Starts the whole stack locally: PostgreSQL, the Vendure Engine (:3001) and the Svelte Commerce
# Storefront (:3000). Logs go to .dev/*.log. Safe to re-run: anything already up is left alone.
#
#   scripts/dev.sh           start everything (loads the catalogue into an empty database)
#   scripts/dev.sh stop      stop the Engine and Storefront
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUN="$ROOT/.dev"
mkdir -p "$RUN"

DB_URL="${DATABASE_URL:-postgres://vendure:vendure@127.0.0.1:5432/vendure}"
ENGINE_URL="http://127.0.0.1:3001"
STOREFRONT_URL="http://127.0.0.1:3000"

if [[ "${1:-}" == "stop" ]]; then
  for f in "$RUN"/*.pid; do
    [[ -f "$f" ]] || continue
    # Each process was started with setsid, so kill its whole group (ts-node, vite and children).
    kill -- "-$(cat "$f")" 2>/dev/null || kill "$(cat "$f")" 2>/dev/null || true
    rm -f "$f"
  done
  echo "stopped"; exit 0
fi

wait_for() { for _ in $(seq 1 "$2"); do curl -sf -o /dev/null "$1" && return 0; sleep 1; done; return 1; }

# PostgreSQL: start the local cluster and create the role and database once.
if ! pg_isready -q -h 127.0.0.1; then
  (service postgresql start || sudo service postgresql start) >/dev/null
  for _ in $(seq 1 20); do pg_isready -q -h 127.0.0.1 && break; sleep 1; done
fi
if ! psql "$DB_URL" -c 'select 1' >/dev/null 2>&1; then
  echo "creating vendure role and database"
  run_pg() { if [[ $EUID -eq 0 ]]; then su postgres -c "psql -q -c \"$1\""; else sudo -u postgres psql -q -c "$1"; fi; }
  run_pg "CREATE USER vendure WITH PASSWORD 'vendure' CREATEDB;" || true
  run_pg "CREATE DATABASE vendure OWNER vendure;" || true
fi

# Vendure Engine.
cd "$ROOT/vendure"
[[ -d node_modules ]] || npm ci --no-audit --no-fund
[[ -f dist/dashboard/index.html ]] || { echo "building the Vendure dashboard"; npx vite build > "$RUN/dashboard-build.log" 2>&1; }
export DATABASE_URL="$DB_URL" STOREFRONT_URL VENDURE_DISABLE_TELEMETRY=true
if ! curl -sf -o /dev/null "$ENGINE_URL/health"; then
  # First run: migrate and load the catalogue before the server starts.
  products="$(psql "$DB_URL" -tAc 'select count(*) from product' 2>/dev/null || echo 0)"
  if [[ "$products" == "0" ]]; then
    echo "loading the catalogue into Vendure"
    npx ts-node src/populate.ts > "$RUN/populate.log" 2>&1 || { echo "catalogue load failed; see $RUN/populate.log"; exit 1; }
  fi
  setsid nohup npx ts-node src/index.ts > "$RUN/vendure.log" 2>&1 &
  echo $! > "$RUN/vendure.pid"
  wait_for "$ENGINE_URL/health" 120 || { echo "vendure did not start; see $RUN/vendure.log"; exit 1; }
fi
echo "vendure     $ENGINE_URL/dashboard  (sign in superadmin / superadmin)"

# Svelte Commerce Storefront.
cd "$ROOT/svelte-commerce"
[[ -f .env ]] || cp .env.example .env
[[ -d node_modules ]] || bun install
if ! curl -sf -o /dev/null "$STOREFRONT_URL/health"; then
  setsid nohup node_modules/.bin/vite dev --host 127.0.0.1 > "$RUN/storefront.log" 2>&1 &
  echo $! > "$RUN/storefront.pid"
  wait_for "$STOREFRONT_URL/health" 60 || { echo "storefront did not start; see $RUN/storefront.log"; exit 1; }
fi
echo "storefront  $STOREFRONT_URL"
