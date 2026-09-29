// The backend is whichever commerce connector this project installs. There is nothing to uncomment
// here and no per-backend module to pick: `src/lib/core/connectors/active.ts` wraps whatever
// `$connector` resolves to, and vite.config.ts resolves that from package.json.
//
//   bun remove @misiki/litekart-connector
//   bun add    @misiki/shopify-connector
//
// is the whole switch. Set `PUBLIC_CONNECTOR` to override it — that is how you attach a connector
// this repo has never heard of (`PUBLIC_CONNECTOR='@my-co/custom-connector'`), and how you choose
// when more than one is installed. Every backend but Litekart also needs its own PUBLIC_<NAME>_*
// env; `src/lib/core/connectors/init.ts` derives which one and fails at boot naming it when it is
// missing. See docs/CONNECTORS.md.
export * as services from './src/lib/core/connectors/active'

// Connectors without a Litekart API behind them read store details from static config instead.
// Merge store identity overrides here — name, logo, favicon, currency, menus, plugins,
// cssVariables — over the extracted defaults (src/lib/core/connectors/default-store.json).
//
// One value is not yours to flip: `isEmailMandatory` is forced true for those connectors (see
// src/lib/core/connectors/static-store.ts). Setting it false here does not make the email optional,
// it only defers the failure to the payment step — on Vendure, `State Transition Failed: Cannot
// transition Order to the "ArrangingPayment" state without Customer details`, with the shopper
// stranded there.
import defaults from './src/lib/core/connectors/default-store.json'

export default {
	// Tempered's identity (design/assets/Logos): the crowned mark is the header logo and favicon.
	name: 'Tempered',
	logo: '/tempered/mark.png',
	favicon: '/tempered/favicon.png',
	// Product shots are 4:5 (design/README.md → Imagery); cards, gallery and placeholders read this.
	productImageAspectRatio: '4:5',
	// The look comes from the default Theme in src/app.css. A runtime merchant palette would be
	// painted over it (store-palette.svelte, and the SSR palette tag in routes/+layout.svelte), so it
	// stays empty: the brand can't be broken by a stray setting. See ADR 0001.
	cssVariables: {} as Partial<typeof defaults.cssVariables>,
	// Vendure runs promotions, so show the bag's promo-code box. Spread: overriding `plugins` replaces them all.
	// The newsletter stays hidden until a provider is chosen.
	plugins: {
		...defaults.plugins,
		isDiscountCoupons: { ...defaults.plugins.isDiscountCoupons, active: true },
		newsletter: { ...defaults.plugins.newsletter, active: false }
	},
	// Tempered's prices include tax (the Vendure channel's pricesIncludeTax), so the price summary
	// shows the tax inside the total rather than as an extra charge.
	currency: { ...defaults.currency, includesTax: true },
	// The header's menu is the Engine's Shop Categories plus Shop all, filled in by the root layout
	// load (src/lib/theme/default/catalogue-tree.ts); nothing here names a Category.
}
