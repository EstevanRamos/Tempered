// The listing filters a shopper sees (CONTEXT.md): Category, the broad kind of clothing (Tops,
// Bottoms, …), and Type, the specific garment within it (Tees, Joggers, …). Both are Tags on the
// product, so both are Engine facets; Badge is a facet too, but it is a highlight, not a filter.
//
// They travel in the URL as `?category=Tops,Bottoms&type=Tees`: values within a group are ORed,
// the groups ANDed. vendure-corrections.ts uses these to filter the Engine's search.

/** The filter groups, in the order the panel lists them, keyed by the facet's code. */
export const FILTER_FACETS = ['category', 'type'] as const
export type FilterFacet = (typeof FILTER_FACETS)[number]

type FacetValueCount = { count?: number; facetValue?: { id?: string; name?: string; facet?: { code?: string; name?: string } } }

const facetOf = (value: FacetValueCount['facetValue']) => (value?.facet?.code ?? value?.facet?.name ?? '').toLowerCase()
const isFilter = (code: string): code is FilterFacet => (FILTER_FACETS as readonly string[]).includes(code)

/** Each filter group's values with their counts, `{ category: { Tops: 3 }, type: { Tees: 3 } }`. */
export function facetGroups(facetValues: FacetValueCount[] | null | undefined): Partial<Record<FilterFacet, Record<string, number>>> {
	const groups: Partial<Record<FilterFacet, Record<string, number>>> = {}
	for (const code of FILTER_FACETS) {
		for (const { count, facetValue } of facetValues ?? []) {
			if (facetOf(facetValue) !== code || !facetValue?.name) continue
			;(groups[code] ??= {})[facetValue.name] = count ?? 0
		}
	}
	return groups
}

/** Each filter group's values by lower-cased name, mapped to the Engine's id. */
export function facetIds(facetValues: FacetValueCount[] | null | undefined): Partial<Record<FilterFacet, Record<string, string>>> {
	const ids: Partial<Record<FilterFacet, Record<string, string>>> = {}
	for (const { facetValue } of facetValues ?? []) {
		const code = facetOf(facetValue)
		if (!isFilter(code) || !facetValue?.id || !facetValue.name) continue
		;(ids[code] ??= {})[facetValue.name.toLowerCase()] = facetValue.id
	}
	return ids
}

/** Decode once, and only when the value actually round-trips (the filter panel encodes twice). */
function decodeOnce(value: string) {
	try {
		return decodeURIComponent(value)
	} catch {
		return value
	}
}

/** The Category and Type values the URL selects. Groups with nothing selected are absent. */
export function selectedFacets(url: URL): Partial<Record<FilterFacet, string[]>> {
	const selected: Partial<Record<FilterFacet, string[]>> = {}
	for (const code of FILTER_FACETS) {
		const values = (url.searchParams.get(code) ?? '')
			.split(',')
			.map((v) => decodeOnce(v).trim())
			.filter(Boolean)
		if (values.length) selected[code] = values
	}
	return selected
}

/**
 * The Engine's `facetValueFilters` for a selection: one `or` per group, the groups ANDed. Null when
 * a group selects nothing the Engine has, so the caller shows no products rather than ignoring the
 * filter and showing them all.
 */
export function facetValueFilters(
	selected: Partial<Record<FilterFacet, string[]>>,
	ids: Partial<Record<FilterFacet, Record<string, string>>>
): { or: string[] }[] | null {
	const filters: { or: string[] }[] = []
	for (const code of FILTER_FACETS) {
		const values = selected[code]
		if (!values?.length) continue
		const or = values.map((v) => ids[code]?.[v.toLowerCase()]).filter((id): id is string => !!id)
		if (!or.length) return null
		filters.push({ or })
	}
	return filters
}
