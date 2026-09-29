import { wwwLoad } from '$lib/core/load-functions/index.js'
import { categoryService, collectionService, productService, SearchService } from '$lib/core/services/index.js'
import { withTileImages, type CatalogueTree } from '$lib/theme/default/catalogue-tree.js'
import type { PageLoad } from './$types'

// HomepageModule fetches the featured products in a `$effect` and the featured categories in an
// `onMount` — neither runs on the server. The homepage is the highest-authority page on the site
// and the entry point for every crawl, and it was server-rendering no product links, no category
// links and an empty ItemList: a crawler that does not execute JS saw an empty storefront.
// Fetching them here puts them in the SSR HTML. The module keeps owning the load-more accumulator
// and everything else it does on the client.
//
// Failures degrade to an empty list rather than taking the homepage down with them — the page
// already renders empty/loading states for both, and the theme sections around them are static.
export const load: PageLoad = async (event) => {
	const base = await wwwLoad(event)

	const [featuredProducts, featuredCategories] = await Promise.all([
		productService
			.listFeaturedProducts({ page: 1, sort: '-createdAt' })
			.then((r: { data?: unknown[] } | undefined) => r?.data ?? [])
			.catch(() => []),
		categoryService
			.fetchFeaturedCategories({ limit: 18 })
			.then((r: { data?: unknown[] } | undefined) => r?.data ?? [])
			.catch(() => [])
	])

	// Tempered (the default theme) also needs its Collection tiles, each with an image (a Collection
	// with none takes its first product's), and its featured products from search, whose results
	// carry the Badge and sold-out state the card shows.
	const parent = (await event.parent()) as { theme?: { name?: string }; catalogue?: CatalogueTree }
	if ((parent.theme?.name ?? 'default') !== 'default') return { ...base, featuredProducts, featuredCategories }

	const [collectionTiles, homeProducts] = await Promise.all([
		withTileImages(parent.catalogue?.collections ?? [], async (slug) => {
			const collection = await collectionService.getOne(slug)
			return collection?.collectionvalues?.[0]?.products?.thumbnail ?? null
		}),
		new SearchService(event.fetch)
			.searchWithQuery('')
			.then((r: { data?: unknown[] } | undefined) => r?.data ?? [])
			.catch(() => [])
	])

	return { ...base, featuredProducts, featuredCategories, collectionTiles, homeProducts }
}
