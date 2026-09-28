# Tabs

Quiet segmented tabs: uppercase `label` in `ink-muted`; the active tab gets `ink` text, a `line-strong` hairline box and a `surface-raised` fill.

Inputs: `items` (strings or `{label, value}`), and either `value` + `onChange` (controlled) or `defaultValue`. Use for switching the view inside one section (product details, collection filters). Max five items; centre them under a `SectionHeader`.
