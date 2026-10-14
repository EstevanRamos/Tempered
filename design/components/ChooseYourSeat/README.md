# ChooseYourSeat

The homepage band that sends you into the shop: one [CollectionTile](../CollectionTile/README.md) for each **Drop** (a Collection under Drops) and then each **Category** (under Shop), never one per Type. Shoppers see a Collection called a Drop.

From 768px the tiles sit in one row, as many columns as there are tiles, with a 4px seam, 760px tall from 1024px (560px below). On a phone it is a snapping carousel, one tile per screen, with a hairline dot per tile beneath it (16px, `line-strong`; the current one `ink`).

Each tile: the photograph darkened (brightness .55, saturation .7) under a bottom scrim; bottom-left, the name in `title-l`, the subtitle in `eyebrow` `ink-muted`, then the arrow line in `label` ("Explore" for a Drop, "Shop" for a Category). The image zooms to 1.04 over 800ms on hover. A tile's subtitle and image can be set per slug; otherwise the Engine's description and image are used.

Opens under a centred SectionHeader (eyebrow "Collections", title "Choose your seat", no rule). The band is the anchor `#collections` that the header's Collections link scrolls to. No gold.
