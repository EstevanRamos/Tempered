# Tempered design system

The Tempered brand and UI system: black, bone and one gold. It was built from the first homepage concept, the crowned-elephant logo and the inspiration sites (Odd Ritual, Infinite Machine, Hopaal).

Live version (brand book, token tables and component cards): https://claude.ai/artifact/T4mhAMHCxAUqTYM8GruWAm

## What's here

| Path | What |
| --- | --- |
| `tokens.json` | Source of truth: colours (Night + Bone themes), type, spacing, radius, shadow, layout |
| `tokens.css` | The tokens as CSS custom properties; `data-theme="bone"` switches to the light theme |
| `components.css` | Framework-free component styles, classes prefixed `tp-` |
| `components/<Name>/` | Guidelines (`README.md`) and a standalone `preview.html` per component |
| `homepage/` | The reference homepage built only from the above; open `homepage/index.html` in a browser |
| `screenshots/` | Full-page renders of the homepage at 1440px, Night and Bone |
| `assets/Logos`, `assets/Imagery` | Transparent logo cut-outs and placeholder photography from the concept |

Previews and the homepage load the fonts from Google Fonts; open them straight from disk, no build step needed. To port to Svelte, import `tokens.css` and `components.css` once in the root layout, then make one component per `components/<Name>/preview.html` (the class modifiers become props).

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
- Casing: display and labels UPPERCASE (set with CSS `text-transform`, write the source in sentence case); body in sentence case. No exclamation marks, no emoji, no slang about gambling or luck.
- Signature line, used sparingly as a sign-off: *Play with purpose.*

## Colour

Night (dark) is the house theme; Bone (light) is for editorial and journal pages, receipts and email, inspired by gallery-white product pages.

- Page on `ground`; image wells, footer and quiet bands on `surface`; floating sheets on `surface-raised` with `shadow-overlay`.
- Text in `ink`; supporting copy and prices in `ink-muted`; placeholders and legal in `ink-faint`. All three hold ≥4.5:1 on every ground in both themes.
- `gold` is the crown: the logo, the focus ring, the cart count, the short rule under a heading, and **at most one** `gold` Button per view. Text on gold uses `on-gold`. Hover a gold fill to `gold-deep`.
- Dividers are `line`; anything interactive that needs an edge (inputs, size chips, tabs) uses `line-strong` (≥3:1).
- `danger` (orange) and `positive` (steel blue) are status only, always paired with a word: "Sold out", "In stock".

## Typography

Two families from Google Fonts: **Cormorant Garamond** (`--font-display`) for the voice, **Hanken Grotesk** (`--font-sans`) for everything functional. Load weights 400/500/600 and 400 italic.

- `display-xl` — the hero wordmark and campaign lines, 1–2 words, tracked 0.14em.
- `display-l` — section statements ("MORE THAN A GAME.").
- `heading` — section titles; `title` — tile and product names on product pages.
- `quote` — the manifesto line in italic, sentence case.
- `body-l` for the lead under a statement, `body` for copy, `small` for meta. Keep lines under `measure`.
- `label` for buttons, nav, tabs and card names; `eyebrow` for the tracked line above headings and for the ValueList. Always uppercase.
- `price` with `font-variant-numeric: tabular-nums`.

Never set body copy in the serif, never track lowercase text, never go below 11px.

## Layout & spacing

- 12-column grid inside `container-max`; gutters `space-8` desktop, `space-4` mobile. Images may bleed full width.
- Bands stack with `space-24` top and bottom (`space-16` on mobile); hero and manifesto get `space-32`.
- Product grids: 4 across desktop, 2 across mobile. Collection tiles: 3 across with a 4px seam.
- Split bands (image + story) are 50/50 or 7/5; text column never wider than `measure`.

## Motion & states

- Durations 200ms for colour, 240ms for the arrow nudge (4px right on hover), 600–800ms for the slow image zoom (scale 1.03–1.04). Easing `cubic-bezier(.2,.7,.2,1)`. Nothing bounces; honour `prefers-reduced-motion`.
- Hover: outline fills with `ink`; links gain a hairline underline; images zoom slowly.
- Focus: a 1px solid `gold` outline, 3px offset — ≥5:1 on every ground in both themes.
- Disabled: `ink-faint` text on a `line-strong` edge; out-of-stock sizes are struck through.

## Imagery

Low-key, desaturated, warm-black photography: chips, cards, hands at the felt, the crowned elephant, spartans, mountain ridges at dusk. Deep shadows, a single light source, no bright colour except gold. Product shots on a seamless black (Night) ground, garment centred, 4:5.

Keep text out of the image itself; put it on the ground or on the tile scrim. See the **Imagery** group for the reference set.

## Logo

The crowned elephant mark, in gold foil, with the handwritten *Tempered* signature.

- `tempered-lockup.png` (mark + signature, transparent) — splash, footer, packaging, about pages. **Night grounds only**: the signature is white.
- `tempered-mark.png` (mark alone, transparent gold) — header, favicon source, product embroidery reference. Works on both themes.
- The typographic wordmark **TEMPERED** is set live in `display-xl` / Cormorant Garamond with 0.14–0.36em tracking; it is not an image.
- Clear space: the height of the crown on every side. Minimum mark height 28px on screen. Never recolour, outline, add effects, or place the mark on a photograph without a dark scrim.

## Iconography

Almost none. The only glyph is the hairline arrow (16×10, 1px stroke, `currentColor`) used by Button, TextLink, Input and CollectionTile. Utility actions are words, not icons: "Search", "Account", "Cart (0)", "Menu". If an icon is unavoidable (close, plus/minus for quantity), draw it as a 1px stroke at 16px to match the arrow. No emoji, no filled icon sets.

## Building with it

The components are plain HTML + CSS (`components.css`, classes prefixed `tp-`) on top of the tokens, with no framework, so they map one-to-one onto Svelte components: each preview's markup is the template, the class modifiers (`tp-btn--gold`, `is-on`, `is-error`) are the props. Load the two Google Fonts families before the stylesheet.
