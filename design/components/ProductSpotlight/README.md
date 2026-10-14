# ProductSpotlight

The homepage's collection band: one piece at a time instead of a grid. A large square image of the chosen piece (columns 3–7 of 12 from 1024px), and beside it (columns 9–10) the name in `label` with the price in `price` across a `line` hairline, a short note in `small` `ink-faint`, an accent [TextLink](../TextLink/README.md) "View piece", and a thumbnail per piece (3:4, on `surface`) to choose another. Unchosen thumbnails sit at 45% opacity; the chosen one is at full opacity with an `ink` hairline under it.

It replaces the 4-card Featured grid. Up to four pieces. Below 1024px it stacks: image, name and price, note and link on one line, then the four thumbnails in a row.

Opens under a centred [SectionHeader](../SectionHeader/README.md) with a `text` lead and no rule; an outline Button ("Shop this collection") follows it, centred. No gold: the image is the band's moment.
