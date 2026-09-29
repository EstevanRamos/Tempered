# Vendure is the Engine

The Storefront needs a free, open-source Engine that comes with its own admin, and the launch needs customer accounts and discount codes. We chose **Vendure** (GPLv3, with the Admin UI). Among the 26 backends svelte-commerce supports, it is the only open-source one with hand-written wiring in this repo (not the generic template connector) that covers the whole browse → cart → checkout → order path plus email login and coupon codes (39/43 services). GoCommerce, which the Storefront was first wired to, is replaced.

## Considered Options

- **GoCommerce** (MIT, already running): the lightest to host, but pre-1.0 with an unstable API, one maintainer, and no customer accounts or discount codes through the connector (10/43).
- **Medusa** (MIT): has dedicated wiring, but its connector is less complete and its own docs contradict themselves on cart and auth.
- **Saleor** (BSD-3): its connector does not yet wire cart, checkout or orders.
- **Litekart**: the most complete connector, but a hosted service rather than a FOSS backend we run.
- **The other ~21 platforms**: either not open source, missing customer login in the connector, far too thin, too heavy for a small store, or only on the generic template connector, which has never met a live store.

## Consequences

- GPLv3's obligations apply when Vendure itself is *distributed*. Running it unmodified on our own server, with the Storefront talking to it over its API, is not distribution. That is the licence's plain reading, not legal advice; revisit it before shipping modified Vendure code to anyone.
- No connector, Vendure's included, had been run against a live store when this was decided. The spike in `docs/spikes/2026-09-vendure.md` then ran the full shopper path against Vendure with no blockers.
- Store identity, menus and CMS content do not come from Vendure. They stay in `kitcommerce.config.ts` and the Theme's static content.
