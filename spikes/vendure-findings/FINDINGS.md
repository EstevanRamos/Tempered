# Vendure spike: findings

**Question:** Does svelte-commerce, through `@misiki/vendure-connector`, work end to end against a real Vendure server?

**Verdict: yes.** The whole shopper path works against Vendure 3.7.3 with the connector at 2.0.40. Nothing found is a blocker. Everything that broke is a config setting or a small, local storefront fix.

Setup: Vendure scaffolded with `npx @vendure/create --ci` (SQLite, demo catalogue with 54 products and 9 collections) on :3001, with `authOptions.requireVerification: false`. The storefront was started with `PUBLIC_CONNECTOR=@misiki/vendure-connector` and `PUBLIC_VENDURE_API_URL=http://localhost:3001`. The discount code `TEMPERED10` (10% off the order) was created through the Admin API. The walkthrough scripts are in `walkthrough/` and the screenshots sit beside this file.

## Shopper path

| Step | Result |
| --- | --- |
| Homepage, listing, pagination, search ("camera"), collection pages | ✅ Vendure products; search returns only matching products |
| Product page: images, two variant groups, price change on variant, stock | ✅ |
| Add to bag, cart page, quantity controls | ✅ The cart persists across visits (Vendure active order via cookie) |
| Discount code | ✅ once enabled in config (see below); 10% applied and totals recalculated |
| Address form, then shipping methods from Vendure ($5 / $10) | ✅ |
| Review, then confirm, then success page | ✅ Order `YSY8S6MNCHFD9M54`: Vendure shows PaymentAuthorized, the coupon recorded, the customer attached |
| Sign up (same email as the guest order) | ✅ Logged straight in, and **the guest order is linked to the new account** |
| Log out → `/my/orders` redirects to login → log in with password | ✅ |
| Order history and order detail | ✅ The detail page shows correct discounted totals |

## What needs fixing, by kind

**Config (switch ticket)**
1. **The discount-code box is off by default.** `plugins.isDiscountCoupons.active` is `false` in `default-store.json`, so turn it on in `kitcommerce.config.ts`. The store merge in `static-store.ts` is **shallow**: overriding `plugins` replaces all of them, so spread the defaults (`{ ...defaults.plugins, isDiscountCoupons: { active: true } }`). The same trap applies to every nested key (menu, currency, …).
2. The Vendure scaffold has **anonymous telemetry on**, so set `VENDURE_DISABLE_TELEMETRY=true`.
3. The spike ran on SQLite. The real setup should run on Postgres (the `pg` driver plus `dbConnectionOptions`) with migrations, not `synchronize`.
4. The email plugin's links point at `localhost:8080`, so set them to the storefront's verify and reset URLs.
5. Store identity is still the default "Test" (name, logo, menus); set it in `kitcommerce.config.ts` as planned.

**Small storefront fixes (the restyle tickets touch these pages anyway)**

6. **Order history list shows the pre-discount price** ($1678.80) where the detail page correctly shows $1515.92 charged.
7. **Status labels are raw Vendure states** ("PAYMENTAUTHORIZED", "Your order is currently PaymentAuthorized"). They need human labels.
8. **"Tax" line reads as additive.** The demo prices include 20% tax, and the total correctly excludes it again, but the summary lists Tax as its own line, so it should say "incl. tax".
9. **The discount has no line of its own.** The subtotal silently shows the discounted figure; show "Discount (TEMPERED10) −$167.88".
10. **The payment method shows "COD"** for Vendure's dummy handler. Check the label mapping once a real Stripe method exists.
11. **The sign-up success page says "Please verify your email"** while verification is off.
12. **Accessibility and markup:**
    - the promo trigger is a `<button>` inside a `<button>`;
    - checkout renders two nested `<main>` elements;
    - the sign-up page puts a `<div>` inside a `<p>` (a Svelte SSR warning).

**Not a problem**
- `setCustomerForOrder → NO_ACTIVE_ORDER_ERROR` on login with an empty cart is harmless noise.
- Stripe.js and ipify requests fail only because this sandbox blocks outside hosts.

## Affects the plan

- **The storefront's Playwright specs can't be the definition of done.** Most of the testids they use (`product-card`, `featured-product-card`, `shipping-name`, `complete-order`, `hero-section`, …) do not exist anywhere in `src/`. The walkthrough scripts here are the better base: turn them into one "shopper path" spec in the switch ticket, and every later ticket keeps it green.
- `/auth/login` is not a page (it returns 404). Login is a modal opened with `/?show_auth=true&login=true`.
