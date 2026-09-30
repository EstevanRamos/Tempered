# Stops the Storefront, the Vendure Engine and Postgres started by dev.ps1. Same as `scripts\dev.ps1 stop`.
& (Join-Path $PSScriptRoot 'dev.ps1') stop
