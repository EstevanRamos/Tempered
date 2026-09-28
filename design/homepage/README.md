# HomePage

The reference storefront homepage: every band is built from the system's tokens and `tp-` components, top to bottom.

1. **Header**: sticky, `line` hairline beneath.
2. **Hero**: always Night (`data-theme="night"`) because it is photographic. The elephant sits on the right 62% and fades into `ground`. On the left: `eyebrow` → `TEMPERED` in `display-xl` → `body-l` in `ink-muted` → outline Button. A ValueList sits bottom-right.
3. **Collections**: three CollectionTiles, 420px tall, with a 4px seam.
4. **Featured collection**: SectionHeader with "View all", then 4 ProductCards at a `space-6` gap. The band has `space-24` above and below.
5. **Manifesto**: a 7/5 split, image left. The copy column has `eyebrow`, `display-l` and `body-l` at most `measure` wide, then an outline Button, with a ValueList bottom-right.
6. **Quote**: the gold mark, the manifesto line in `quote` style at 40px, and the "Play with purpose" sign-off in `gold`. It gets `space-32` of air.
7. **Join the table**: a `surface` band with a heading on the left and the newsletter Input on the right.
8. **Footer**: lockup, three link columns, a legal line, and a giant `TEMPERED` wordmark bleeding off the bottom.

On mobile everything stacks: tiles go 1-up, products 2-up and the manifesto splits into image then copy. Gutters drop to `space-4` and band padding to `space-16`. In Bone, swap the footer lockup for the typographic wordmark, because the white signature disappears on light grounds.
