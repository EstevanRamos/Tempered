# Button

The rectangular action: hairline-bordered, uppercase `label` type, square corners (`radius-none`).

**Variants**
- `outline` (default): `ink` hairline on transparent; fills `ink` on hover. The hero "Shop now →" and most CTAs.
- `solid`: `ink` fill with `ground` text. The primary action on a product page ("Add to bag").
- `gold`: `gold` fill with `on-gold` text. **One per view at most**, reserved for money moments (Checkout, Pre-order).
- `ghost`: text-only with arrow, for tertiary actions inside dense bands.

**Inputs**: `children` (short verb, 1–3 words), `variant`, `size` (`md` 48px tall, `sm` 36px), `arrow` for forward motion (navigation, never for destructive actions), `href` to render a link.

**Do** keep labels to verbs in the brand voice: "Shop now", "Explore", "Add to bag". **Don't** round the corners, add icons other than the arrow, or put two gold buttons side by side.
