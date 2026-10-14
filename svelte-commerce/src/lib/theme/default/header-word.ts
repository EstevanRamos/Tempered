// The Header's utility actions are words, not icons (design/README.md → Iconography): "Search",
// "Account", "Cart 0", "Menu". One class string so the header's own links and the shared search,
// account and cart triggers (which render it when given `words`) read as one row. 44px tall on
// phones, uppercase `label` type, ink-muted at rest and ink on hover (design/components/Header).
export const headerWord =
	'inline-flex min-h-11 items-center whitespace-nowrap text-label uppercase text-muted-foreground transition-colors duration-200 hover:text-foreground md:min-h-9'
