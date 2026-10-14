# CollectionTile

A full-bleed photograph with a bottom scrim, the name in the display serif, a tracked subtitle and an arrow CTA. Text always sits bottom-left (or bottom-right with `align="end"` when the subject sits left).

Inputs: `image` (dark, desaturated, subject away from the text corner), `title`, `subtitle`, `cta`, `href`, optional `height` (default 320px). Tiles sit in a row with a 4px seam, or stack full-width on mobile. Text colours inside are fixed to the Night values because the tile is always photographic. The image zooms to 1.04 over 800ms on hover; the arrow nudges 4px.

The name is in `title` at the default size; in [ChooseYourSeat](../ChooseYourSeat/README.md), where tiles run full height, it steps up to `title-l`. A tile for a Collection is called by the Drop's name; its CTA reads "Explore". A tile for a Category reads "Shop".
