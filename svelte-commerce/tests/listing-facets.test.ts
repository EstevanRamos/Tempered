import { describe, it, expect } from 'vitest'
import { facetGroups, facetIds, selectedFacets, facetValueFilters } from '$lib/core/connectors/listing-facets'

// A search's facet values as the Engine returns them: Category and Type are the shopper's filters;
// Badge is not.
const facetValues = [
	{ count: 3, facetValue: { id: '1', name: 'Tops', facet: { code: 'category', name: 'Category' } } },
	{ count: 3, facetValue: { id: '2', name: 'Tees', facet: { code: 'type', name: 'Type' } } },
	{ count: 1, facetValue: { id: '3', name: 'New', facet: { code: 'badge', name: 'Badge' } } },
	{ count: 1, facetValue: { id: '5', name: 'Bottoms', facet: { code: 'category', name: 'Category' } } },
	{ count: 1, facetValue: { id: '6', name: 'Joggers', facet: { code: 'type', name: 'Type' } } }
]

describe('facetGroups', () => {
	it('groups the Category and Type values with their counts, Category first, and leaves Badge out', () => {
		expect(facetGroups(facetValues)).toEqual({ category: { Tops: 3, Bottoms: 1 }, type: { Tees: 3, Joggers: 1 } })
	})

	it('reads the facet name when the Engine gives no code', () => {
		expect(facetGroups([{ count: 2, facetValue: { id: '9', name: 'Hats', facet: { name: 'Type' } } }])).toEqual({ type: { Hats: 2 } })
	})

	it('is empty for no facet values', () => {
		expect(facetGroups(undefined)).toEqual({})
	})
})

describe('selectedFacets', () => {
	it('reads the category and type parameters, comma-separated', () => {
		const url = new URL('http://x/products?category=Tops,Bottoms&type=Tees&sort=price&badge=New')
		expect(selectedFacets(url)).toEqual({ category: ['Tops', 'Bottoms'], type: ['Tees'] })
	})

	it('decodes a value the filter panel encoded once more', () => {
		expect(selectedFacets(new URL('http://x/products?type=Bucket%2520hats'))).toEqual({ type: ['Bucket hats'] })
	})

	it('is empty when nothing is selected', () => {
		expect(selectedFacets(new URL('http://x/products?search=tee'))).toEqual({})
	})
})

describe('facetValueFilters', () => {
	const ids = facetIds(facetValues)

	it('ORs the values within a group and ANDs the groups, by Engine id', () => {
		expect(facetValueFilters({ category: ['Tops', 'Bottoms'], type: ['Tees'] }, ids)).toEqual([{ or: ['1', '5'] }, { or: ['2'] }])
	})

	it('matches names regardless of case', () => {
		expect(facetValueFilters({ type: ['tees'] }, ids)).toEqual([{ or: ['2'] }])
	})

	it('is null when a group names nothing the Engine has, so the listing is empty rather than unfiltered', () => {
		expect(facetValueFilters({ type: ['Hats'] }, ids)).toBeNull()
	})
})
