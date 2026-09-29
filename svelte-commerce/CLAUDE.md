# Svelte Commerce

Open-source headless storefront: SvelteKit 2 + Svelte 5 (runes) + TypeScript + Tailwind 3.4 +
shadcn-svelte/bits-ui, talking to any of 26 commerce backends through `@misiki/*-connector`
packages. Services, stores and load functions come from `@misiki/kitcommerce-core`; the UI lives here.

## UX and design system

Every storefront UI change follows the project UX system. Read it before touching a route or
component, and audit before redesigning:

@UX_SYSTEM.md

The current repository-level audit and priorities are in `docs/UX_AUDIT.md`.

## Facts worth not rediscovering

These cost real effort to establish. Read them before exploring, and if you spawn subagents, put
the relevant ones in their prompts so each does not re-derive them.

**Verifying**

- `bun run check` is **broken**: it shells out to `sync-connector-types.js`, which is not in the
  repo, and exits before type-checking. Use `bunx svelte-check --tsconfig ./tsconfig.json` instead.
- svelte-check baseline on 2026-09-03 is **150 errors, 102 warnings, 66 files**, all pre-existing.
  Compare against that number; do not treat it as your regression.
- Unit tests: `bunx vitest run`. Playwright specs expect the app on `http://localhost:3000`.
- The shopper-path test (`bun run test:shopper`, `tests/shopper-path/`) is the definition of done:
  one end-to-end walk against the running stack, selecting by role and name. Keep it green. The
  other Playwright specs query test IDs that don't exist in `src/`; don't rely on them.
- Playwright: the bundled browser build may not match. Set `PLAYWRIGHT_CHROMIUM_PATH` (cloud
  sessions: `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`) or launch with `channel: 'chrome'`. From Git Bash, prefix a route argument with `MSYS_NO_PATHCONV=1` or `/products`
  is rewritten into a Windows path.
- `bun run dev` serves the default theme. `PUBLIC_STOREFRONT_THEME=<name>` overrides it, but only
  when the store record carries no theme of its own.

**The local backend**

- The active connector is `@misiki/vendure-connector`, talking to the Vendure Engine in
  `../vendure` via `PUBLIC_VENDURE_API_URL=http://127.0.0.1:3001` (the only backend variable).
  `../scripts/dev.sh` starts Postgres, Vendure and this storefront, loading the catalogue on first run.
- Browser and server calls both go straight to `<PUBLIC_VENDURE_API_URL>/shop-api`; Vendure answers
  CORS for the storefront origin with credentials. Use `127.0.0.1`, not `localhost`: the session
  cookie is scoped to the API's host.
- Vendure has no store record, so identity (name, logo, menus, plugin toggles) comes from
  `src/lib/core/connectors/default-store.json` merged under `kitcommerce.config.ts`'s default export.
  **The merge is shallow**: overriding a nested key (`plugins`, `menu`, …) replaces all of it, so
  spread the defaults.
- Services Vendure lacks (blogs, banners, reels, …) return empty lists; that is expected, not a bug.
- `/auth/login` is not a page. Login is a modal opened with `/?show_auth=true&login=true`.

**Ownership: what you may not edit**

- `src/lib/core/**` and `node_modules/**` are package-owned (`@misiki/kitcommerce-core`, the
  connectors). Wrap behaviour at the call site, or in the active connector's module under
  `src/lib/core/connectors/`; never edit in place.
- `src/lib/theme/{wine,organic,lime,noor}/**` is out of design scope. Do not break it, do not
  design for it.
- `package.json` and `bun.lock` are often modified by a parallel session working in this same
  directory. Leave them alone unless the task is about dependencies.

## Conventions

- Backend: no file names a connector. `vite.config.ts` resolves whichever `@misiki/*-connector`
  `package.json` installs (override with `PUBLIC_CONNECTOR`) and exposes it as `$connector`;
  `src/lib/core/connectors/active.ts` is the single module wrapping it, for every backend. App
  code never imports a connector package by name; use `$lib/core/services`.
- Tokens: `src/app.css` (per `[data-theme]` HSL variables) mapped by `tailwind.config.ts`. Use the
  semantic utilities (`bg-background`, `text-muted-foreground`, `border`, `bg-primary`, …), the
  `--radius`-derived `rounded-*` scale and `.page-width`. No hard-coded hex colours or arbitrary
  `z-[…]` values in components.
- Primitives: `src/lib/components/ui/*` (shadcn-svelte). Do not add another UI library.
- Svelte 5 only: `$props`, `$state`, `$derived`, snippets. No `<svelte:component>`, no legacy stores in new code.
- Formatting: Prettier (tabs, single quotes, no semicolons) — `bun run format`.
- Verify: `bun run check` for types, `bun run test:unit` for vitest, `bun run test` for Playwright
  (expects the app on `http://localhost:3000`).
