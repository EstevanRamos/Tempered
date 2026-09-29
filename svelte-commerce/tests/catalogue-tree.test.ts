import { describe, it, expect } from 'vitest'
import { catalogueTree, withShopMenu, withTileImages } from '$lib/theme/default/catalogue-tree'

// The Engine's collections as the category service maps them: a flat list with parent ids.
const engine = [
	{ id: '2', name: 'Shop', slug: 'shop', parentCategoryId: '1', thumbnail: 'shop.webp' },
	{ id: '3', name: 'Tees', slug: 'tees', parentCategoryId: '2', thumbnail: 'tees.webp' },
	{ id: '6', name: 'War', slug: 'war', parentCategoryId: '5', thumbnail: 'war.webp', description: 'Poker is war' },
	{ id: '4', name: 'Joggers', slug: 'joggers', parentCategoryId: '2', thumbnail: null },
	{ id: '5', name: 'Drops', slug: 'drops', parentCategoryId: '1', thumbnail: 'drops.webp' }
]

describe('catalogueTree', () => {
	it('lists the Categories under Shop and the Collections under Drops, in Engine order', () => {
		const tree = catalogueTree(engine)
		expect(tree.categories.map((c) => c.name)).toEqual(['Tees', 'Joggers'])
		expect(tree.collections.map((c) => c.name)).toEqual(['War'])
	})

	it('links each to its bare slug and keeps its image and description', () => {
		const { categories, collections } = catalogueTree(engine)
		expect(categories[0]).toMatchObject({ name: 'Tees', link: '/tees', image: 'tees.webp' })
		expect(categories[1].image).toBeNull()
		expect(collections[0]).toMatchObject({ link: '/war', description: 'Poker is war' })
	})

	it('is empty when the Engine has no Shop or Drops tree', () => {
		expect(catalogueTree([])).toEqual({ categories: [], collections: [] })
		expect(catalogueTree(undefined)).toEqual({ categories: [], collections: [] })
		expect(catalogueTree([{ id: '9', name: 'Misc', slug: 'misc', parentCategoryId: '1' }])).toEqual({ categories: [], collections: [] })
	})
})

describe('withShopMenu', () => {
	const menu = [
		{ menuId: 'header', name: 'Header', items: [{ id: 'nav-home', link: '/', name: 'Home' }] },
		{ menuId: 'footer', name: 'Footer', items: [{ id: 'f', link: '/faqs', name: 'FAQs' }] }
	]

	it('replaces the header items with the Categories plus Shop all, leaving other menus alone', () => {
		const next = withShopMenu(menu, catalogueTree(engine).categories)
		expect(next.find((m) => m.menuId === 'header')?.items).toEqual([
			{ id: 'nav-tees', link: '/tees', name: 'Tees' },
			{ id: 'nav-joggers', link: '/joggers', name: 'Joggers' },
			{ id: 'nav-shop-all', link: '/products', name: 'Shop all' }
		])
		expect(next.find((m) => m.menuId === 'footer')).toBe(menu[1])
	})

	it('keeps the configured menu when the Engine has no Categories', () => {
		expect(withShopMenu(menu, [])).toBe(menu)
	})
})

describe('withTileImages', () => {
	const entry = (slug: string, image: string | null) => ({ id: slug, name: slug, slug, link: `/${slug}`, image, description: null })

	it("fills a Collection with no image from its first product's image, and asks only for those", async () => {
		const asked: string[] = []
		const firstProductImage = async (slug: string) => {
			asked.push(slug)
			return slug === 'war' ? 'war-tee.webp' : null
		}
		const tiles = await withTileImages([entry('war', null), entry('dawn', 'dawn.webp'), entry('empty', null)], firstProductImage)
		expect(tiles.map((t) => t.image)).toEqual(['war-tee.webp', 'dawn.webp', null])
		expect(asked).toEqual(['war', 'empty'])
	})

	it('keeps a tile when looking up its product fails', async () => {
		const tiles = await withTileImages([entry('war', null)], async () => {
			throw new Error('down')
		})
		expect(tiles).toEqual([entry('war', null)])
	})
})
