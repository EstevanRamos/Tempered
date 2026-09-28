#!/bin/bash
# SessionStart hook for Claude Code on the web: the container is wiped when idle, so bring the
# whole stack back on every new session: PostgreSQL, the Vendure Engine (:3001, with the catalogue
# loaded on first run) and the Svelte Commerce Storefront (:3000).
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Dependencies first, as plain installs (not frozen) so the cached container keeps them.
(cd svelte-commerce && bun install)
(cd vendure && npm install --no-audit --no-fund)

# Postgres + Engine + Storefront, all idempotent: anything already running is left alone.
scripts/dev.sh
