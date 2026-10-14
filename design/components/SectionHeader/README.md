# SectionHeader

Opens a band: optional `eyebrow`, a `heading` in the display serif (uppercase, tracked, balanced), a 32px `gold` rule beneath, an optional `text` lead, and an optional trailing `TextLink`.

Inputs: `title`, and optionally `eyebrow`, `text`, `action {label, href}`, `align` (`start` for catalogue bands with a trailing link, `center` for statements), `rule` (default on), `as` for the heading level. Leave `space-12` between the header and the content it introduces.

- **`text`**: one sentence in `body`, `ink-muted`, at most `measure` wide, `space-6` under the title (centred under a centred header). "Heavyweight essentials, cut boxy and made to outlast the session."
- **`rule`**: the gold rule is a gold element. Turn it off (`rule={false}`) wherever the view's gold moment is elsewhere: every homepage band (the glint, The Code's numerals and the crest are its gold) and the brand bands of Our Story. Keep it on catalogue and editorial pages where nothing else is gold.
