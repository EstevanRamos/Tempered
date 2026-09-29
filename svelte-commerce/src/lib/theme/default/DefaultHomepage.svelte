<script lang="ts">
	// Tempered's homepage (design/homepage, design/screenshots/home-night.png), band by band: the hero,
	// the tiles, featured products, the manifesto and the quote. Copy is the theme content's
	// `tempered` block; Collections and products come from the Engine. A band with nothing real to
	// show is left out rather than filled with placeholders.
	import { page } from '$app/state'
	import type { ThemeHomepageProps } from '../homepages.js'
	import type { CatalogueEntry } from './catalogue-tree.js'
	import DefaultProductCard from './DefaultProductCard.svelte'
	import Arrow from './Arrow.svelte'
	import LinkButton from './LinkButton.svelte'
	import SectionHeader from './SectionHeader.svelte'
	import TextLink from './TextLink.svelte'
	import ValueList from './ValueList.svelte'

	let { themeContent, featuredProducts = [] }: ThemeHomepageProps = $props()

	const content = $derived(themeContent.tempered)
	const catalogue = $derived(page.data?.catalogue ?? { categories: [], collections: [] })
	const collections = $derived<CatalogueEntry[]>(page.data?.collectionTiles ?? catalogue.collections ?? [])
	// Search results carry Badge and sold-out; the featured feed is the fallback.
	const products = $derived<any[]>((page.data?.homeProducts?.length ? page.data.homeProducts : featuredProducts).slice(0, 4))

	type Tile = { title: string; subtitle: string; cta: string; href: string; image: string | null; end?: boolean }
	const tiles = $derived.by<Tile[]>(() => {
		if (!content) return []
		const shopAll: Tile = {
			title: content.tiles.shopAll.title,
			subtitle: catalogue.categories.map((c: CatalogueEntry) => c.name).join(' · '),
			cta: content.tiles.shopAll.cta,
			href: '/products',
			image: content.tiles.shopAll.image
		}
		const drops: Tile[] = collections.map((c) => ({
			title: `${c.name} collection`,
			subtitle: c.description ?? '',
			cta: content.tiles.collection.cta,
			href: c.link,
			image: c.image
		}))
		// The story tile's subject sits left, so its text sits bottom-right.
		const story: Tile = { ...content.tiles.story, end: true }
		return [shopAll, ...drops, story]
	})
</script>

{#if content}
	<!-- Hero: always photographic. The elephant holds the right of the band and fades into the ground;
	     the copy sits on the ground at the left, never over the face. -->
	<section class="hero relative overflow-hidden border-b border-border" aria-labelledby="home-title">
		<img src={content.hero.image} alt={content.hero.imageAlt} class="hero__img" fetchpriority="high" />
		<div class="hero__fade" aria-hidden="true"></div>
		<div class="page-width relative flex h-full flex-col justify-end gap-12 pb-16 pt-2 md:flex-row md:items-end md:justify-between md:pb-24 md:pt-0">
			<div class="max-w-[640px]">
				<p class="text-eyebrow uppercase text-muted-foreground">{content.hero.eyebrow}</p>
				<h1
					id="home-title"
					class="-mr-[0.14em] mb-4 mt-6 font-serif text-[48px] font-normal uppercase leading-none tracking-[0.14em] text-foreground sm:text-[72px] lg:text-display-xl"
				>
					{content.hero.title}
				</h1>
				<p class="mb-12 max-w-measure text-body-l text-muted-foreground">{content.hero.text}</p>
				<LinkButton href={content.hero.href}>{content.hero.cta}</LinkButton>
			</div>
			<ValueList items={content.hero.values} label="What we stand for" class="max-md:hidden" />
		</div>
	</section>

	<!-- Tiles: Shop all, one per Collection under Drops in the Engine, and the Story page. -->
	<section class="tiles mt-1 grid grid-cols-1 gap-1" style="--tile-count: {tiles.length}" aria-label="Shop by collection">
		{#each tiles as tile (tile.href)}
			<a href={tile.href} class="tile group">
				{#if tile.image}
					<img src={tile.image} alt="" class="tile__img" loading="lazy" />
				{/if}
				<span class="tile__scrim" aria-hidden="true"></span>
				<span class="tile__body" class:tile__body--end={tile.end}>
					<span class="font-serif text-title uppercase tracking-[0.12em]">{tile.title}</span>
					{#if tile.subtitle}
						<span class="text-eyebrow uppercase tracking-[0.28em] text-muted-foreground">{tile.subtitle}</span>
					{/if}
					<span class="mt-4 inline-flex items-center gap-2 text-eyebrow uppercase tracking-[0.2em]">{tile.cta} <Arrow /></span>
				</span>
			</a>
		{/each}
	</section>

	<!-- Featured products, on the new product card. -->
	{#if products.length}
		<section class="page-width py-16 md:py-24" aria-labelledby="home-featured">
			<SectionHeader id="home-featured" title={content.featured.title}>
				{#snippet action()}
					<TextLink href={content.featured.viewAllHref}>{content.featured.viewAll}</TextLink>
				{/snippet}
			</SectionHeader>
			<div class="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
				{#each products as product, i (product.id)}
					<DefaultProductCard {product} priority={i < 2} />
				{/each}
			</div>
		</section>
	{/if}

	<!-- Manifesto: image then copy, 7/5 on desktop. -->
	<section class="manifesto grid border-y border-border lg:grid-cols-[7fr_5fr]" aria-labelledby="home-manifesto">
		<img src={content.manifesto.image} alt={content.manifesto.imageAlt} class="aspect-[4/3] h-full w-full object-cover lg:aspect-auto" loading="lazy" />
		<div class="relative flex flex-col justify-center px-4 py-16 sm:px-8 lg:py-24 lg:pl-16">
			<p class="text-eyebrow uppercase text-muted-foreground">{content.manifesto.eyebrow}</p>
			<h2
				id="home-manifesto"
				class="mb-6 mt-4 max-w-[12ch] font-serif text-[40px] font-normal uppercase leading-[44px] tracking-[0.1em] text-foreground lg:text-display-l"
			>
				{content.manifesto.title}
			</h2>
			<p class="mb-12 max-w-measure text-body-l text-muted-foreground">{content.manifesto.text}</p>
			<div class="flex flex-wrap items-end justify-between gap-10">
				<LinkButton href={content.manifesto.href}>{content.manifesto.cta}</LinkButton>
				<ValueList items={content.manifesto.values} label="The virtues" />
			</div>
		</div>
	</section>

	<!-- Quote: the mark, the manifesto line, the sign-off in gold. -->
	<figure class="page-width px-4 py-24 text-center md:py-32">
		<img src="/tempered/mark.png" alt="" class="mx-auto h-[72px] w-auto md:h-[88px]" loading="lazy" />
		<blockquote class="mx-auto mb-4 mt-8 max-w-[720px] font-serif text-[28px] italic leading-[38px] text-foreground md:text-[40px] md:leading-[52px]">
			“{content.quote.text}”
		</blockquote>
		<figcaption class="text-eyebrow uppercase text-primary">{content.quote.signoff}</figcaption>
	</figure>
{/if}

<style>
	/* Hero: 720px on desktop, the copy beside the image. On a phone the image takes the top and
	   fades down into the ground, and the copy sits beneath it, clear of the face. */
	.hero__img {
		display: block;
		width: 100%;
		height: 380px;
		object-fit: cover;
		object-position: 60% 20%;
	}

	.hero__fade {
		position: absolute;
		inset: 0 0 auto;
		height: 380px;
		background: linear-gradient(0deg, hsl(var(--background)) 0%, hsl(var(--background) / 0) 45%);
	}

	@media (min-width: 768px) {
		.hero {
			height: 720px;
		}

		.hero__img {
			position: absolute;
			top: 0;
			right: 0;
			width: 62%;
			height: 100%;
			object-position: 50% 20%;
		}

		.hero__fade {
			inset: 0;
			height: auto;
			background:
				linear-gradient(90deg, hsl(var(--background)) 38%, hsl(var(--background) / 0.6) 52%, hsl(var(--background) / 0) 72%),
				linear-gradient(0deg, hsl(var(--background)) 0%, hsl(var(--background) / 0) 22%);
		}
	}

	/* CollectionTile: a full-bleed photograph with a bottom scrim, text bottom-left (or bottom-right),
	   the image zooming slowly on hover. Always photographic, so the text is Night's ink. 1 per row on
	   a phone; one row with a 4px seam from 1024px. */
	.tile {
		position: relative;
		display: block;
		height: 320px;
		overflow: hidden;
		background: hsl(var(--card));
		color: hsl(var(--foreground));
	}

	@media (min-width: 1024px) {
		.tiles {
			grid-template-columns: repeat(var(--tile-count), minmax(0, 1fr));
		}

		.tile {
			height: 420px;
		}
	}

	.tile__img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.8s var(--motion-ease);
	}

	.tile:hover .tile__img {
		transform: scale(1.04);
	}

	.tile__scrim {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, hsl(var(--background) / 0) 35%, hsl(var(--background) / 0.82) 100%);
	}

	.tile__body {
		position: absolute;
		inset: auto 32px 32px 32px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
	}

	.tile__body--end {
		align-items: flex-end;
		text-align: right;
	}

	@media (prefers-reduced-motion: reduce) {
		.tile__img {
			transition: none;
		}

		.tile:hover .tile__img {
			transform: none;
		}
	}
</style>
