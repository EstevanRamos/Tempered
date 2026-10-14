<script lang="ts">
	// The Drops page (CONTEXT.md): every Collection under Drops, as tiles in Tempered style, in
	// shopper language. Categories, the Shop and Drops parents are not listed here; Categories are
	// browsed from Shop. The Drops come from the layout's catalogue tree, so a Drop added in the
	// Engine appears here with no code change; a tile's subtitle and art can be set per slug in the
	// theme content (`tempered.seats.tiles`), as on the homepage.
	import { page } from '$app/state'
	import SeoHeader from '$lib/components/seo/seo-header.svelte'
	import { resolveThemeContent } from '$lib/theme/index.js'
	import type { CatalogueEntry } from '$lib/theme/default/catalogue-tree.js'
	import CollectionTile from '$lib/theme/default/CollectionTile.svelte'
	import LinkButton from '$lib/theme/default/LinkButton.svelte'
	import SectionHeader from '$lib/theme/default/SectionHeader.svelte'

	const seats = $derived(resolveThemeContent('default', page.data?.store)?.tempered?.seats)
	const drops = $derived(
		((page.data?.catalogue?.collections ?? []) as CatalogueEntry[]).map((entry) => {
			const own = seats?.tiles?.[entry.slug] ?? {}
			return { href: entry.link, title: entry.name, subtitle: own.subtitle ?? entry.description ?? '', image: own.image ?? entry.image }
		})
	)
</script>

<SeoHeader metaTitle="Drops" metaDescription="Every Tempered drop: limited pieces, designed and released together." />

<section class="page-width py-16 md:py-24" aria-labelledby="drops-title">
	<SectionHeader id="drops-title" as="h1" eyebrow="Tempered" title="Drops" text="Limited pieces, designed and released together." />

	{#if drops.length}
		<ul class="mt-8 grid grid-cols-1 gap-1 md:mt-12 md:grid-cols-2 lg:grid-cols-3">
			{#each drops as drop (drop.href)}
				<li>
					<CollectionTile {...drop} cta={seats?.collectionCta ?? 'Explore'} class="h-[480px] lg:h-[560px]" />
				</li>
			{/each}
		</ul>
	{:else}
		<div class="mt-8 flex flex-col items-start gap-6 border-t border-border pt-8 md:mt-12">
			<p class="max-w-measure text-body text-muted-foreground">No drop is out right now. The next one is on its way.</p>
			<LinkButton href="/products">Shop all</LinkButton>
		</div>
	{/if}
</section>
