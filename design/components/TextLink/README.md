# TextLink

The tracked uppercase link with a hairline arrow ("View all →"), underlined in `currentColor` on hover.

Use it for section-level navigation beside a `SectionHeader`, inside tiles, and at the end of a story band. The consumer provides `href` and a 1–3 word label.

Variants:

- **default** (`ink`): no underline at rest, a `currentColor` hairline on hover.
- **muted** (`ink-muted`): utility links like "Size guide" and The Code's "Our philosophy".
- **accent**: the `ink` hairline stays under it at rest, for the one link a band exists to send you through (ProductSpotlight's "View piece"). It is never gold: gold is the view's one moment, and a link is not it.

Set `arrow={false}` for inline utility links.
