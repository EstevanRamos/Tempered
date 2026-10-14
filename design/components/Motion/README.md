# Motion

Three moving things, all slow, none bouncing. Easing `cubic-bezier(.2,.7,.2,1)` throughout. Each one stops entirely under `prefers-reduced-motion: reduce`.

| Name | What moves | Timing | Reduced motion |
| --- | --- | --- | --- |
| **Scroll reveal** | A band (or a tile, a numeral column) fades up 24px into place the first time it scrolls into view. Elements arriving together stagger left to right, top to bottom, 90ms apart, capped at 360ms. | Opacity 700ms, transform 900ms | Not applied: everything is simply there. |
| **Hero title glint** | A narrow `gold` / `gold-deep` glint crosses the TEMPERED wordmark left to right, clipped to the letters, then the title rests in `ink`. | 9s cycle: the sweep takes the first 22% (~2s), then rest; starts after 1.2s | No glint: plain `ink`. |
| **Crest shimmer** | An `ink` highlight sweeps across the QuoteBand's `gold-deep` crest. | 5s cycle: the sweep takes 60%, then rest | Still, highlight centred. |

Rules:

- The reveal is progressive: server HTML is fully visible, and only elements below the fold are hidden, on the client, before they reveal. Nothing a shopper can already see blinks out.
- The glint and the shimmer are gold, so each is its view's **one gold element**: on the homepage, the hero's (glint) and the quote band's (shimmer). Nothing else gold may share their view.
- Hover motion stays as specified elsewhere: 200ms colour, 240ms arrow nudge, 800ms image zoom.
