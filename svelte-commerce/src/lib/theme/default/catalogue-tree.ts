// Tempered's catalogue shape in the Engine (see the README's "The catalogue"): under a "Shop" parent,
// one Collection per Category, filled from Tags; under a "Drops" parent, hand-picked Collections.
// The category service returns the Engine's collections as one flat list with parent ids; this
// turns that into the two lists the Storefront shows: Categories (header nav) and Collections
// (homepage tiles). Adding a Collection in the Engine adds it here with no code change.

/** A collection as the category service maps it. Only the fields read here. */
export interface EngineCollection {
	id: string
	name: string
	slug: string
	parentCategoryId?: string | null
	thumbnail?: string | null
	description?: string | null
}

export interface CatalogueEntry {
	id: string
	name: string
	slug: string
	/** Collections are served at their bare slug (`/tees`, `/war`). */
	link: string
	image: string | null
	description: string | null
}

export interface CatalogueTree {
	categories: CatalogueEntry[]
	collections: CatalogueEntry[]
}

const SHOP_SLUG = 'shop'
const DROPS_SLUG = 'drops'

export function catalogueTree(all: EngineCollection[] | null | undefined): CatalogueTree {
	const list = all ?? []
	const childrenOf = (slug: string): CatalogueEntry[] => {
		const parent = list.find((c) => c.slug === slug)
		if (!parent) return []
		return list
			.filter((c) => c.parentCategoryId === parent.id)
			.map((c) => ({
				id: c.id,
				name: c.name,
				slug: c.slug,
				link: `/${c.slug}`,
				image: c.thumbnail ?? null,
				description: c.description ?? null
			}))
	}
	return { categories: childrenOf(SHOP_SLUG), collections: childrenOf(DROPS_SLUG) }
}

interface MenuItem {
	id: string
	link: string
	name: string
}

interface Menu {
	menuId: string
	items?: unknown[]
}

/**
 * The store's menus with the header's items replaced by the Categories plus Shop all. Every other
 * menu (the footer) is returned as it was. With no Categories the configured menus stand.
 */
export function withShopMenu<M extends Menu>(menus: M[], categories: CatalogueEntry[]): M[] {
	if (!categories.length) return menus
	const items: MenuItem[] = [
		...categories.map((c) => ({ id: `nav-${c.slug}`, link: c.link, name: c.name })),
		{ id: 'nav-shop-all', link: '/products', name: 'Shop all' }
	]
	return menus.map((menu) => (menu.menuId === 'header' ? { ...menu, items } : menu))
}

/**
 * Collections ready for homepage tiles: one with no image of its own takes its first product's
 * image. `firstProductImage` is asked only for those, and a failed lookup leaves the tile as it was.
 */
export async function withTileImages(
	entries: CatalogueEntry[],
	firstProductImage: (slug: string) => Promise<string | null | undefined>
): Promise<CatalogueEntry[]> {
	return Promise.all(
		entries.map(async (entry) => {
			if (entry.image) return entry
			try {
				const image = await firstProductImage(entry.slug)
				return image ? { ...entry, image } : entry
			} catch {
				return entry
			}
		})
	)
}
