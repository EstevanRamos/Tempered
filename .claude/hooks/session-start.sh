#!/bin/bash
# SessionStart hook for Claude Code on the web: the container is wiped when idle, so bring the
# whole stack back on every new session — submodules, PostgreSQL, the GoCommerce engine (:8080,
# seeded with the demo catalog) and the Svelte Commerce storefront (:3000).
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Storefront deps first: `bun install` (not a frozen install) so the cached container keeps them.
(cd svelte-commerce && bun install)

# Postgres + engine + storefront, all idempotent: anything already running is left alone.
scripts/dev.sh --seed
