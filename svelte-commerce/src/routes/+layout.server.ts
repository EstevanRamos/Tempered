import { error } from '@sveltejs/kit'
import { layoutServer } from '$lib/core/load-functions/index.js'
import { resolveStorefrontTheme } from '$lib/theme/index.js'
import { publishedCmsSlugs } from '$lib/components/common/cms-pages.js'
import { categoryService } from '$lib/core/services/index.js'
import { catalogueTree, withShopMenu } from '$lib/theme/default/catalogue-tree.js'

export async function load(event: any) {
	// No store maps to this domain (flagged in hooks). Render the app's 404 page instead of a 500.
	if (event.locals?.storeNotFound) {
		throw error(404, 'Store not found')
	}
	const [data, collections] = await Promise.all([
		layoutServer(event),
		// The Engine's Collections, read once per request. A failure leaves the configured menus and
		// no tiles rather than taking every page down.
		categoryService
			.fetchAllCategories()
			.then((r: { data?: unknown[] } | undefined) => r?.data ?? [])
			.catch(() => [])
	])
	// Categories (under Shop) drive the header nav; Collections (under Drops) the homepage tiles.
	const catalogue = catalogueTree(collections as Parameters<typeof catalogueTree>[0])
	const store = data?.store?.menu ? { ...data.store, menu: withShopMenu(data.store.menu, catalogue.categories) } : data?.store
	return {
		...data,
		store,
		catalogue,
		theme: resolveStorefrontTheme(data?.store),
		// Which CMS-backed policy pages this store actually publishes, so the footer never links one
		// that 404s. Resolved once per server process, and empty when the backend has no CMS.
		cmsPages: await publishedCmsSlugs()
	}
}
