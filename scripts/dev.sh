#!/usr/bin/env bash
# Starts the whole stack locally: PostgreSQL, the GoCommerce engine (:8080) and the
# Svelte Commerce storefront (:3000). Logs go to .dev/*.log.
#
#   scripts/dev.sh           start everything
#   scripts/dev.sh --seed    ...and load the demo catalog
#   scripts/dev.sh stop      stop the engine and storefront
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUN="$ROOT/.dev"
mkdir -p "$RUN/media"

DB_URL="${DATABASE_URL:-postgres://gocommerce:gocommerce@127.0.0.1:5432/gocommerce?sslmode=disable}"
TOKEN="${GOCOMMERCE_ADMIN_TOKEN:-dev-token}"

if [[ "${1:-}" == "stop" ]]; then
  for f in "$RUN"/*.pid; do [[ -f "$f" ]] && { kill "$(cat "$f")" 2>/dev/null || true; }; rm -f "$f"; done
  echo "stopped"; exit 0
fi

# Submodules (gocommerce) on a fresh clone.
git -C "$ROOT" submodule update --init --recursive

# PostgreSQL: start the local cluster and create the role/database once.
if ! pg_isready -q -h 127.0.0.1; then
  (service postgresql start || sudo service postgresql start) >/dev/null
  for _ in $(seq 1 20); do pg_isready -q -h 127.0.0.1 && break; sleep 1; done
fi
if ! psql "$DB_URL" -c 'select 1' >/dev/null 2>&1; then
  echo "creating gocommerce role and database"
  run_pg() { if [[ $EUID -eq 0 ]]; then su postgres -c "psql -q -c \"$1\""; else sudo -u postgres psql -q -c "$1"; fi; }
  run_pg "CREATE USER gocommerce WITH PASSWORD 'gocommerce' CREATEDB;" || true
  run_pg "CREATE DATABASE gocommerce OWNER gocommerce;" || true
fi

# GoCommerce engine.
if ! curl -sf http://127.0.0.1:8080/health >/dev/null; then
  echo "building gocommerce"
  (cd "$ROOT/gocommerce" && go build -o "$RUN/gocommerce" ./cmd/gocommerce)
  DATABASE_URL="$DB_URL" \
  GOCOMMERCE_ADMIN_EMAIL="${GOCOMMERCE_ADMIN_EMAIL:-admin@example.com}" \
  GOCOMMERCE_ADMIN_PASSWORD="${GOCOMMERCE_ADMIN_PASSWORD:-devpassword}" \
    setsid nohup "$RUN/gocommerce" -addr 127.0.0.1:8080 -admin-token "$TOKEN" -media-dir "$RUN/media" \
      -identity -menus -reviews -contact -newsletter -cms -faq -wishlist serve \
      > "$RUN/gocommerce.log" 2>&1 &
  echo $! > "$RUN/gocommerce.pid"
  for _ in $(seq 1 30); do curl -sf http://127.0.0.1:8080/health >/dev/null && break; sleep 1; done
fi
curl -sf http://127.0.0.1:8080/health >/dev/null || { echo "gocommerce did not start; see $RUN/gocommerce.log"; exit 1; }
echo "gocommerce  http://127.0.0.1:8080  (admin panel; token $TOKEN)"

[[ "${1:-}" == "--seed" ]] && GC_TOKEN="$TOKEN" "$ROOT/scripts/seed.sh"

# Svelte Commerce storefront.
cd "$ROOT/svelte-commerce"
[[ -f .env ]] || cp .env.example .env
[[ -d node_modules ]] || bun install
if ! curl -sf -o /dev/null http://127.0.0.1:3000/health; then
  setsid nohup node_modules/.bin/vite dev > "$RUN/storefront.log" 2>&1 &
  echo $! > "$RUN/storefront.pid"
  for _ in $(seq 1 60); do curl -sf -o /dev/null http://127.0.0.1:3000/health && break; sleep 1; done
fi
echo "storefront  http://127.0.0.1:3000"
