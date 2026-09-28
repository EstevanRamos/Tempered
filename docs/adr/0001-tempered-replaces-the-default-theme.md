# Tempered replaces the Storefront's default Theme

The Storefront (svelte-commerce) is a multi-merchant template with five runtime Themes and its own design rules (`svelte-commerce/UX_SYSTEM.md`: tokens only in `src/app.css`, shadcn-svelte primitives only, one token vocabulary). We deliver Tempered by rewriting the **default** Theme: `design/tokens.json` is translated into the default block of `app.css` and the default-Theme components (homepage, product card, nav, footer). `design/` governs how things look; `UX_SYSTEM.md` still governs how the code is written. The other four Themes and the white-label machinery stay in place, unused, with Tempered's identity set through store config and the runtime merchant palette removed.

## Considered Options

- **A sixth `tempered` Theme alongside the others**: rejected because the nav, footer and product card already branch per Theme, and a new branch doubles that code for a Theme nobody else will use.
- **Importing `design/tokens.css` and `components.css` (`tp-` classes) directly**: rejected because it adds a second token vocabulary beside the Tailwind/HSL one and fights shadcn primitives. `design/` stays the framework-free reference and is not loaded by the Storefront.
- **Stripping the white-label machinery now**: deferred as a separate cleanup; it is a wide deletion with no visible benefit at launch.

## Consequences

- A token change starts in `design/tokens.json`, then is mirrored by hand into `app.css`. Nothing keeps the two in sync automatically.
- `default-store.json`'s `cssVariables` must stay empty, or it silently overrides the Tempered palette at runtime.
