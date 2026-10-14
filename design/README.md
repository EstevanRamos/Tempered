# Tempered design system

The Tempered brand and UI system: black, bone and one gold. It was built from the first homepage concept, the crowned-elephant logo and the inspiration sites (Odd Ritual, Infinite Machine, Hopaal).

Live version (brand book, token tables and component cards): https://claude.ai/artifact/T4mhAMHCxAUqTYM8GruWAm. **It lags this folder**: it predates the September 2026 homepage redesign (no ProductSpotlight, ChooseYourSeat, TheCode, QuoteBand, MobileMenu, FloatingHeader, Footer or Motion, and the old gold and wordmark rules). Where they differ, this folder wins.

## What's here

| Path | What |
| --- | --- |
| `tokens.json` | Source of truth: colours (Night + Bone themes), type, spacing, radius, shadow, layout |
| `tokens.css` | The tokens as CSS custom properties; `data-theme="bone"` switches to the light theme |
| `components.css` | Framework-free component styles, classes prefixed `tp-` |
| `components/<Name>/` | Guidelines (`README.md`) and a standalone `preview.html` per component |
| `homepage/` | The reference homepage built only from the above; open `homepage/index.html` in a browser |
| `screenshots/` | Full-page renders of the reference homepage in Night, at 1440px (`home-night.png`) and 390px (`home-night-390.png`) |
| `assets/Logos`, `assets/Imagery` | Transparent logo cut-outs and placeholder photography from the concept |

Previews and the homepage load the fonts from Google Fonts; open them straight from disk, no build step needed. To port to Svelte, import `tokens.css` and `components.css` once in the root layout, then make one component per `components/<Name>/preview.html` (the class modifiers become props).

### Components

| Group | Components |
| --- | --- |
| Actions | Button, TextLink (default, muted, accent) |
| Page frame | Header, FloatingHeader (homepage), MobileMenu, Footer |
| Bands | SectionHeader, ProductSpotlight, ChooseYourSeat, TheCode, QuoteBand |
| Catalogue | ProductCard, CollectionTile, Badge, SizeSelector, Tabs, Input |
| Brand | ValueList (hero only), Cover |
| Behaviour | Motion (scroll reveal, hero title glint, crest shimmer) |

---

Tempered is poker-born apparel for people who treat the table as a discipline. The system is **black, bone and one gold**: a dark, editorial storefront where photography carries the mood, a tracked serif carries the voice, and everything else gets out of the way. Sleek, minimal, functional — every element either sells, tells the story, or leaves.

## Principles

- **Restraint is the brand.** One idea per band, one gold element per view, generous space (`space-24` between bands). If a section needs a second accent, it needs fewer words.
- **Cut, not rounded.** `radius-none` on buttons, cards, inputs and images. Hairlines (`hairline`, 1px) instead of shadows or fills.
- **Photography leads, type frames it.** Full-bleed, low-key images; type sits on the ground beside them or bottom-left on a scrim — never centred over a face.
- **Functional first.** Prices, sizes, stock and cart are always legible and one tap away. Mood never hides a control.

## Voice

Short, declarative, earned. Stoic, not aggressive; about self-mastery, not winning.

- Headlines in the imperative or as a verdict: "Master yourself before you master the table." "Discipline builds freedom." "Poker is war." "More than a game."
- Body copy speaks to **you**, the brand is **we**, in plain sentences: "We create apparel for those committed to a higher standard."
- Shoppers see a Collection (a hand-picked group released together, such as War) called a **Drop**, or by its name. A Category (Tees, Joggers) is never called a collection.
- Casing: display and labels UPPERCASE (set with CSS `text-transform`, write the source in sentence case); body in sentence case. No exclamation marks, no emoji, no slang about gambling or luck.
- Signature line, used sparingly as a sign-off: *Play with purpose.*

## Colour

Night (dark) is the house theme; Bone (light) is for editorial and journal pages, receipts and email, inspired by gallery-white product pages.

- Page on `ground`; image wells, footer and quiet bands on `surface`; floating sheets on `surface-raised` with `shadow-overlay`.
- Text in `ink`; supporting copy and prices in `ink-muted`; placeholders and legal in `ink-faint`. All three hold ≥4.5:1 on every ground in both themes.
- `gold` is the crown, and **one gold element per view**: in any viewport, at any width, at most one thing is gold. Gold elements are a `gold` Button, the 32px rule under a SectionHeader, the hero title's glint, The Code's numerals (the five count as one), the QuoteBand's crest, and any gold text, fill or hairline. Two things never count: **the logo mark** (it is the brand, not an accent) and **the focus ring** (accessibility comes first). Text on gold uses `on-gold`. Hover a gold fill to `gold-deep`.
- The cart count is lit in `ink`, not gold: a header on every view would otherwise spend the gold everywhere.
- On the homepage the gold moments are the hero title's glint, The Code's numerals and the QuoteBand's crest shimmer; Shop now is an outline Button, the spotlight's link is `ink`, every band's SectionHeader drops its rule, and the bands are ordered so no two moments share a view.
- Dividers are `line`; anything interactive that needs an edge (inputs, size chips, tabs) uses `line-strong` (≥3:1).
- `danger` (orange) and `positive` (steel blue) are status only, always paired with a word: "Sold out", "In stock".

## Typography

Two families from Google Fonts: **Cormorant Garamond** (`--font-display`) for the voice, **Hanken Grotesk** (`--font-sans`) for everything functional. Load weights 400/500/600 and 400 italic. A third, **Bodoni Moda** (`--font-numeral`, 400, optical size 6–96), is reserved for outlined ornament, drawn as a hairline stroke with no fill: the Roman numerals of The Code in `gold-deep`, and the footer wordmark in `line-strong`. Never set words to read in it.

The display sizes are fluid (`clamp()`), from their phone size at 390px to their desktop size at 1440px; `tokens.json` has both ends.

- `display-xl` — the hero wordmark, 1–2 words, tracked 0.14em, never wrapping (56–128px).
- `display-l` — section statements ("MORE THAN A GAME.") and the mobile menu's links (36–52px).
- `heading` — section titles (28–36px).
- `title-l` — Choose your seat tile names (32–40px); `title` — product page name, smaller tiles (24px).
- `quote-l` — the QuoteBand line (28–44px); `quote` — the hero tagline (21–26px). Both italic, sentence case.
- `numeral` / `numeral-l` — The Code's outlined Roman numerals (44px in the phone list, 76px in the row).
- `body-l` for the lead under a statement, `body` for copy, `small` for meta. Keep lines under `measure`.
- `label` for buttons, nav, tabs and card names; `eyebrow` for the tracked line above headings and for the ValueList. Always uppercase.
- `price` with `font-variant-numeric: tabular-nums`.

Never set body copy in the serif, never track lowercase text, never go below 11px.

## Layout & spacing

- 12-column grid inside `container-max`; gutters `space-8` desktop, `space-4` mobile. Images may bleed full width.
- Bands stack with `space-24` between them (`space-16` on mobile); the hero and the manifesto get `space-32`. Use the spacing scale, never a one-off pixel value.
- The header is `header-height` (72px) at every width; the homepage hero reserves that height under the floating header.
- Product grids: 4 across desktop, 2 across mobile. Collection tiles: one row with a 4px seam (ChooseYourSeat: a snapping carousel on a phone).
- Split bands (image + story) are 50/50 or 7/5; text column never wider than `measure`.

## Motion & states

- Durations 200ms for colour, 240ms for the arrow nudge (4px right on hover), 600–800ms for the slow image zoom (scale 1.03–1.04). Easing `cubic-bezier(.2,.7,.2,1)`. Nothing bounces; honour `prefers-reduced-motion`.
- Three slow, ambient motions: the scroll reveal, the hero title glint and the crest shimmer. Timings and reduced-motion behaviour are in [Motion](components/Motion/README.md).
- Hover: outline fills with `ink`; links gain a hairline underline; images zoom slowly.
- Focus: a 1px solid `gold` outline, 3px offset — ≥5:1 on every ground in both themes.
- Disabled: `ink-faint` text on a `line-strong` edge; out-of-stock sizes are struck through.

## Imagery

Low-key, desaturated, warm-black photography: chips, cards, hands at the felt, the crowned elephant, spartans, mountain ridges at dusk. Deep shadows, a single light source, no bright colour except gold. Product shots on a seamless black (Night) ground, garment centred, 4:5.

Keep text out of the image itself; put it on the ground or on the tile scrim. See the **Imagery** group for the reference set.

## Logo

The crowned elephant mark, in gold foil, with the handwritten *Tempered* signature.

- `tempered-lockup.png` (mark + signature, transparent) — splash and packaging. **Night grounds only**: the signature is white. Not used on the site.
- `tempered-mark.png` / `tempered-mark.svg` (mark alone) — header, favicon source, the QuoteBand crest, product embroidery reference. Works on both themes. The header shows the mark alone, with no wordmark under it.
- The typographic wordmark **TEMPERED** is live text, never an image, in exactly two places: the homepage hero, in `display-xl` Cormorant Garamond tracked 0.14em; and the foot of every page, in Bodoni Moda outlined in `line-strong`, stretched edge to edge (see [Footer](components/Footer/README.md)).
- Clear space: the height of the crown on every side. Minimum mark height 28px on screen. Never recolour, outline, add effects, or place the mark on a photograph without a dark scrim.

## Iconography

Almost none. The only glyph is the hairline arrow (16×10, 1px stroke, `currentColor`) used by Button, TextLink, Input and CollectionTile. Utility actions are words, not icons: "Search", "Account", "Cart (0)", "Menu". If an icon is unavoidable (close, plus/minus for quantity), draw it as a 1px stroke at 16px to match the arrow. No emoji, no filled icon sets.

## Building with it

The components are plain HTML + CSS (`components.css`, classes prefixed `tp-`) on top of the tokens, with no framework, so they map one-to-one onto Svelte components: each preview's markup is the template, the class modifiers (`tp-btn--gold`, `is-on`, `is-error`) are the props. Load the two Google Fonts families before the stylesheet.
