import { describe, it, expect } from 'vitest'
import { productBadge } from '$lib/theme/default/product-badge'
import { searchExtras } from '$lib/core/connectors/vendure-corrections'

describe('productBadge', () => {
	it('shows a product badge in its design-system tone', () => {
		expect(productBadge({ badge: 'New' })).toEqual({ label: 'New', tone: 'neutral' })
		expect(productBadge({ badge: 'Limited' })).toEqual({ label: 'Limited', tone: 'gold' })
		expect(productBadge({ badge: 'drop' })).toEqual({ label: 'drop', tone: 'gold' })
	})

	it('says Sold out, in danger, over any other badge: one badge at a time', () => {
		expect(productBadge({ badge: 'Limited', soldOut: true })).toEqual({ label: 'Sold out', tone: 'danger' })
		expect(productBadge({ soldOut: true })).toEqual({ label: 'Sold out', tone: 'danger' })
	})

	it('shows an unknown word as neutral, and nothing without one', () => {
		expect(productBadge({ badge: 'Restocked' })).toEqual({ label: 'Restocked', tone: 'neutral' })
		expect(productBadge({})).toBeNull()
		expect(productBadge({ badge: '  ' })).toBeNull()
		expect(productBadge(undefined)).toBeNull()
	})
})

describe('searchExtras', () => {
	const facetValues = [
		{ facetValue: { id: '1', name: 'Tees', facet: { code: 'category' } } },
		{ facetValue: { id: '2', name: 'New', facet: { code: 'badge' } } },
		{ facetValue: { id: '3', name: 'Limited', facet: { code: 'badge' } } }
	]

	it("reads each result's stock and Badge facet", () => {
		const items = [
			{ inStock: true, facetValueIds: ['1', '1'] },
			{ inStock: true, facetValueIds: ['1', '2', '1', '2'] },
			{ inStock: false, facetValueIds: ['3'] }
		]
		expect(searchExtras(items, facetValues)).toEqual([
			{ soldOut: false, badge: null },
			{ soldOut: false, badge: 'New' },
			{ soldOut: true, badge: 'Limited' }
		])
	})

	it('treats a result with no stock status as available', () => {
		expect(searchExtras([{}], [])).toEqual([{ soldOut: false, badge: null }])
	})
})
