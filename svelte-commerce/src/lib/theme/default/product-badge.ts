// The one badge a product card shows (design/components/Badge). The word always carries the
// meaning; the tone only reinforces it. Sold out is derived from stock and wins over any other
// badge, because one badge per product at a time.

export type BadgeTone = 'neutral' | 'gold' | 'positive' | 'danger'

export interface ProductBadge {
	label: string
	tone: BadgeTone
}

// Gold for scarcity (LIMITED, DROP); everything else, NEW included, is neutral.
const GOLD = new Set(['limited', 'drop'])

export function productBadge(product: { badge?: string | null; soldOut?: boolean } | null | undefined): ProductBadge | null {
	if (product?.soldOut) return { label: 'Sold out', tone: 'danger' }
	const label = product?.badge?.trim()
	if (!label) return null
	return { label, tone: GOLD.has(label.toLowerCase()) ? 'gold' : 'neutral' }
}
