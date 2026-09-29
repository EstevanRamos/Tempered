# Tempered

Tempered's online shop: a custom Storefront built on [Svelte Commerce](https://github.com/itswadesh/svelte-commerce),
running on [Vendure](https://vendure.io) as its Engine (see `docs/adr/0002-vendure-is-the-engine.md`).

| Directory | What | How it's tracked |
| --- | --- | --- |
| `svelte-commerce/` | SvelteKit Storefront, wired to Vendure via `@misiki/vendure-connector` | vendored: edit freely |
| `vendure/` | Vendure 3 server (the Engine) on PostgreSQL, with its admin dashboard | ours |
| `design/` | Tempered's design system | ours |
| `scripts/dev.sh` | Starts everything | |

## Run it

Needs Node 22, Bun, PostgreSQL 16+.

```sh
scripts/dev.sh          # Postgres + Vendure on :3001 + Storefront on :3000
scripts/dev.sh stop
```

- Storefront: http://127.0.0.1:3000
- Vendure dashboard (the owner's admin): http://127.0.0.1:3001/dashboard, signed in as `superadmin` / `superadmin`
- Shop API: http://127.0.0.1:3001/shop-api (GraphiQL at http://127.0.0.1:3001/graphiql/shop)

On first run the script creates the `vendure` role and database, applies the migrations, imports
the Tempered catalogue into the empty database and builds the dashboard. Logs are in `.dev/`. Override
`DATABASE_URL` (and Vendure's `SUPERADMIN_USERNAME`, `SUPERADMIN_PASSWORD`, `COOKIE_SECRET`) in the
environment. In Claude Code on the web, `.claude/hooks/session-start.sh` runs `scripts/dev.sh` at
the start of every session, so the stack is already up.

## The Engine

- Postgres with **migrations**, never schema auto-sync. After changing entities or custom fields,
  run `npm run migration:generate -- <name>` in `vendure/` and commit the file it writes to
  `vendure/src/migrations/`. The server applies pending migrations on start.
- Email verification is off: signing up logs the shopper straight in. Account emails link to the
  Storefront's own `/auth/verify` and `/auth/reset-password` routes (`STOREFRONT_URL`).
- CORS reflects the Storefront's origin with credentials; anonymous telemetry is off.
- Payments use Vendure's dummy handler until production hosting adds Stripe.

## The catalogue

`vendure/catalogue/` holds the Tempered catalogue as Vendure import files, so it can be reloaded
and the same format reused for real products:

- `products.csv`: the products, their size variants, tax-inclusive prices, stock and Category Tag
  (`Category:Tees`), in Vendure's product-import format. Images come from `design/assets/Imagery`.
- `initial-data.json`: countries and zones, tax rates, shipping (Standard $5, Express $10), the
  payment method, and the Collection trees. Under **Shop**, one Collection per Category, filled by
  a Tag filter, so tagging a product is all it takes to put it in a Category. Under **Drops**,
  hand-picked Collections.
- `vendure/src/import-catalogue.ts` loads both, then adds what the import format can't express:
  the hand-picked **War** Collection (the War edition tee) and the `TEMPERED10` promotion (10% off
  the order).

```sh
cd vendure && npm run catalogue:reload   # wipes the database (orders and customers too) and re-imports
```

In the dashboard, the owner edits products, stock and prices; adds a Tag to put a product in a
Category; and hand-picks products into a Collection under Drops. The tax rates are placeholders until the real tax
setup is decided.

## How the Storefront reaches the Engine

- `svelte-commerce/.env` sets `PUBLIC_VENDURE_API_URL=http://127.0.0.1:3001`, and nothing else
  (copied from `.env.example` on first run). Browser and server both call `<that URL>/shop-api`.
- `vite.config.ts` picks the installed `@misiki/*-connector`, here the Vendure one.
- Store name, logo, menus and feature toggles aren't stored in Vendure. They come from
  `svelte-commerce/src/lib/core/connectors/default-store.json`, merged (shallowly) under
  `svelte-commerce/kitcommerce.config.ts`.

## The shopper-path test

One Playwright test walks what a shopper does, against the running stack: homepage → a Category
from the header → search by name → product page (a variant changes the price) → add to bag → the
bag survives a reload → a wrong code is refused, `TEMPERED10` applies, is removed and re-applied →
guest checkout (address → shipping → review → confirm) with the discount and "incl. tax" on every
summary → sign up with the same email → order history shows that order at its charged total and a
plain-word status → order detail → log out → log in from order history and land back on it. Every
change keeps it green.

```sh
cd svelte-commerce && bun run test:shopper
# cloud sessions: PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome bun run test:shopper
```

## Agent skills

`.claude/skills/` holds [Matt Pocock's skills](https://github.com/mattpocock/skills) (MIT, see
`.claude/skills/LICENSE-mattpocock-skills`): the 25 that make up his `mattpocock-skills` plugin,
copied at upstream commit `c55ee46` (plugin v1.2.3). They're plain files, so edit them freely.
Claude Code loads them in every session, including cloud ones where `/plugin` isn't available.
Run `/setup-matt-pocock-skills` once to configure them for this repo.

His `code-review` skill replaces Claude Code's built-in `/code-review` in this repo.
