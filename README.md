# Tempered

A custom storefront built on [Svelte Commerce](https://github.com/itswadesh/svelte-commerce),
backed by the [GoCommerce](https://github.com/itswadesh/gocommerce) engine (the Go, Litekart-compatible API).

| Directory | What | How it's tracked |
| --- | --- | --- |
| `svelte-commerce/` | SvelteKit storefront, wired to GoCommerce via `@misiki/gocommerce-connector` | vendored: edit freely |
| `gocommerce/` | Go commerce engine + admin panel, over PostgreSQL | git submodule (upstream, unmodified) |
| `scripts/` | `dev.sh` (start everything), `seed.sh` (demo catalog) | |

## Run it

Needs Go 1.23+, PostgreSQL 16+, Bun (or Node 22).

```sh
git clone --recurse-submodules <this repo>
scripts/dev.sh --seed     # Postgres + engine on :8080 + storefront on :3000, then load demo products
scripts/dev.sh stop
```

- Storefront: http://127.0.0.1:3000
- GoCommerce admin panel: http://127.0.0.1:8080 (sign in `admin@example.com` / `devpassword`)
- API docs: http://127.0.0.1:8080/docs (admin API token: `dev-token`)

Logs are in `.dev/`. In Claude Code on the web, `.claude/hooks/session-start.sh` runs
`scripts/dev.sh --seed` automatically at the start of every session, so the stack is already up. Override `DATABASE_URL`, `GOCOMMERCE_ADMIN_TOKEN`,
`GOCOMMERCE_ADMIN_EMAIL`, `GOCOMMERCE_ADMIN_PASSWORD` in the environment.

## How the storefront reaches the API

- `svelte-commerce/.env` sets `PUBLIC_GOCOMMERCE_API_URL=http://127.0.0.1:8080` (copied from `.env.example` on first run).
- `vite.config.ts` picks the installed `@misiki/*-connector`, here the GoCommerce one.
- Server-side loads call the engine directly. Browser calls go through
  `svelte-commerce/src/routes/proxy/gocommerce/[...path]`, because GoCommerce sends no CORS headers.
- Store name, logo, menus and feature toggles aren't stored in GoCommerce. They come from
  `svelte-commerce/src/lib/core/connectors/default-store.json` and `svelte-commerce/kitcommerce.config.ts`.

## Agent skills

`.claude/skills/` holds [Matt Pocock's skills](https://github.com/mattpocock/skills) (MIT, see
`.claude/skills/LICENSE-mattpocock-skills`): the 25 that make up his `mattpocock-skills` plugin,
copied at upstream commit `c55ee46` (plugin v1.2.3). They're plain files, so edit them freely.
Claude Code loads them in every session, including cloud ones where `/plugin` isn't available.
Run `/setup-matt-pocock-skills` once to configure them for this repo.

His `code-review` skill replaces Claude Code's built-in `/code-review` in this repo.
