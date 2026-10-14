/**
 * A page title in the Storefront's one pattern, "Name | Store" (the homepage may be the store's
 * name alone). Idempotent, so a caller that already appended the store name is left as it was.
 * Template suffixes ("Cart - Store", "My Orders | Svelte Commerce") are replaced, not doubled.
 */
const TEMPLATE_BRANDS = ['Svelte Commerce', 'Litekart']

export function brandTitle(title: string | null | undefined, storeName: string | null | undefined): string {
	const store = (storeName ?? '').trim()
	let name = String(title ?? '')
		.trim()
		.replace(/^["']+|["']+$/g, '')
		.trim()
	for (const brand of [store, ...TEMPLATE_BRANDS].filter(Boolean)) {
		const suffix = new RegExp(`\\s*[|\\-–—]\\s*${brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i')
		name = name.replace(suffix, '').trim()
	}
	if (!store) return name
	if (!name || name.toLowerCase() === store.toLowerCase()) return store
	return `${name} | ${store}`
}
