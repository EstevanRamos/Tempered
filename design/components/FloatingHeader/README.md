# FloatingHeader

The [Header](../Header/README.md) on the homepage only. Over the hero it is transparent on a soft scrim (`ground` at 60% fading to nothing), with no hairline, so the words hold their contrast on the photograph's dark top edge. The moment the page scrolls (8px) it turns solid: `ground` fill and the `line` hairline beneath, in 200ms. It never sits transparent over product imagery.

The hero reserves the header's height (`header-height`) above its copy; the header pulls itself up over the hero with a negative bottom margin of the same token. Everywhere else the header is solid from the start.

Class: `tp-header tp-header--float`, plus `is-solid` once scrolled.
