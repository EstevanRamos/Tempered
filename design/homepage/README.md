# HomePage

The reference storefront homepage, as shipped in the September 2026 redesign: every band built from the system's tokens and `tp-` components, top to bottom. Open `index.html` in a browser; `../screenshots/home-night.png` (1440px) and `home-night-390.png` (390px) are renders of it.

1. **Header**: the [FloatingHeader](../components/FloatingHeader/README.md), transparent over the hero, solid with its `line` hairline once the page scrolls. The word "Menu" below 1024px.
2. **Hero**: the walking elephant, darkened and faded into `ground` on every side. Copy centred-left: `eyebrow` → TEMPERED in `display-xl` with the **title glint** → the tagline in `quote` → `body` in `ink-muted` → two outline Buttons, "Shop now" and "Choose your seat". The ValueList stands at the right beside a `line-strong` hairline; on a phone it folds into one line under the buttons. `space-32` of air.
3. **The collection**: a centred SectionHeader with a `text` lead and no rule, the [ProductSpotlight](../components/ProductSpotlight/README.md), then an outline Button, "Shop all".
4. **Choose your seat**: [ChooseYourSeat](../components/ChooseYourSeat/README.md), one full-height tile per Drop and per Category with products, a snapping carousel on a phone.
5. **The Code**: [TheCode](../components/TheCode/README.md), five virtues under outlined Bodoni numerals.
6. **Manifesto**: a 50/50 split, image left. `eyebrow`, the statement in `display-l`, `body` at most `measure` wide, an outline Button "Our story". No ValueList, no arrow. `space-32` above and below.
7. **Quote**: the [QuoteBand](../components/QuoteBand/README.md), the crest shimmering in gold foil.
8. **Footer**: the [Footer](../components/Footer/README.md): Join the list, three link columns, hairlines above the columns and the legal line, the outlined Bodoni wordmark.

**Gold**: one element per view. The hero's glint, The Code's numerals and the quote's crest are the page's three gold moments; the manifesto band stands between the last two so they never share a screen. Everything else (Shop now, the spotlight link and thumbnails, the seat dots, the sign-off, the cart count) is ink.

**Spacing**: bands are `space-24` apart (`space-16` on a phone); the hero and the manifesto get `space-32`. Bands reveal on scroll (see [Motion](../components/Motion/README.md)).

On a phone everything stacks: the spotlight becomes image, line, four thumbnails; the seats a carousel; The Code a list; the manifesto image then copy. Gutters drop to `space-4`.

There is no "Join the table" band and no 4-card Featured grid: the spotlight and the footer's Join the list replace them. The reference is Night only; Bone is not used on the homepage.
