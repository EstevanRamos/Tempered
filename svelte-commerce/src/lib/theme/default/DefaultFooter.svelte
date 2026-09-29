<script lang="ts">
	// Tempered's footer (design/homepage, design/screenshots/home-night.png): the lockup, three link
	// columns, a legal line, and the giant TEMPERED wordmark bleeding off the bottom. It sits on
	// `surface`, one step off the page.
	import { page } from '$app/state'
	import { version } from '$app/environment'
	import { keepResolvableLinks } from '$lib/components/common/cms-pages.js'
	import type { CatalogueTree } from './catalogue-tree.js'

	type Link = { name: string; link: string }

	const store = $derived(page.data?.store ?? {})
	const name = $derived(store?.name || 'Tempered')
	const catalogue = $derived<CatalogueTree>(page.data?.catalogue ?? { categories: [], collections: [] })
	const publishedCms = $derived(page.data?.cmsPages ?? [])

	const shop = $derived<Link[]>([...catalogue.categories.map((c) => ({ name: c.name, link: c.link })), { name: 'Shop all', link: '/products' }])
	const brand = $derived<Link[]>([{ name: 'Our story', link: '/our-story' }, ...catalogue.collections.map((c) => ({ name: `${c.name} collection`, link: c.link }))])

	// Help is the store's footer menu, flattened, with the CMS pages this store doesn't publish left
	// out (a dead policy link from every page is worse than none) and the shop links the Shop column
	// already carries dropped.
	const help = $derived.by<Link[]>(() => {
		const footer = store?.menu?.find((menu: { menuId?: string }) => menu?.menuId === 'footer')?.items ?? []
		const flat: Link[] = footer.flatMap((column: { items?: Link[] }) => column?.items ?? []).filter((item: Link) => item?.link && item.link !== '/products')
		const seen = new Set<string>()
		return keepResolvableLinks(flat, publishedCms).filter((item: Link) => !seen.has(item.link.toLowerCase()) && seen.add(item.link.toLowerCase()))
	})

	const columns = $derived(
		[
			{ title: 'Shop', links: shop },
			{ title: 'Brand', links: brand },
			{ title: 'Help', links: help }
		].filter((column) => column.links.length)
	)

	const year = new Date().getFullYear()
</script>

<footer class="overflow-hidden border-t border-border bg-card" aria-label="Site footer" data-build={version}>
	<div class="page-width grid gap-12 pb-12 pt-16 md:grid-cols-[1fr_2fr] md:pt-24">
		<a href="/" class="block w-fit" aria-label="{name}, home">
			<!-- The lockup's signature is white: Night grounds only. -->
			<img src="/tempered/lockup.png" alt="" class="h-24 w-auto md:h-28" width="58" height="100" loading="lazy" />
		</a>
		<div class="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
			{#each columns as column (column.title)}
				<div class="flex flex-col gap-4">
					<h2 class="font-sans text-eyebrow uppercase text-muted-foreground">{column.title}</h2>
					<ul class="flex flex-col">
						{#each column.links as item (item.link)}
							<li>
								<a href={item.link} class="inline-flex min-h-8 items-center text-small text-foreground transition-colors hover:text-primary">
									{item.name}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>

	<div class="page-width flex flex-col gap-2 border-t border-border py-6 text-small text-faint-foreground sm:flex-row sm:items-center sm:justify-between">
		<p>© {year} {name}. A stronger you, a brighter tomorrow.</p>
		<p class="italic">Play with purpose.</p>
	</div>

	<!-- The giant wordmark, set live in the display serif and cut by the page's bottom edge. Decoration:
	     the store's name is already the lockup link's name. -->
	<p
		aria-hidden="true"
		class="-mb-[0.22em] select-none whitespace-nowrap text-center font-serif text-[clamp(48px,13.5vw,260px)] font-normal uppercase leading-none tracking-[0.14em] text-foreground"
	>
		<span class="-mr-[0.14em]">{name}</span>
	</p>
</footer>
