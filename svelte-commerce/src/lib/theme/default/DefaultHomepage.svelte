<script lang="ts">
	// Tempered's homepage (the 2026-09 redesign, design/homepage), band by band: the hero under a
	// floating header, the collection spotlight, Choose your seat, The Code, the manifesto and the
	// quote. Copy is the theme content's `tempered` block; Collections, Categories and products come
	// from the Engine. A band with nothing real to show is left out rather than filled with
	// placeholders. One gold element per view: the hero title's glint, The Code's numerals and the
	// quote's crest are the page's gold moments; everything else is ink.
	import { page } from '$app/state'
	import { reveal } from '$lib/actions/reveal.js'
	import type { ThemeHomepageProps } from '../homepages.js'
	import type { CatalogueEntry } from './catalogue-tree.js'
	import Arrow from './Arrow.svelte'
	import LinkButton from './LinkButton.svelte'
	import ProductSpotlight from './ProductSpotlight.svelte'
	import QuoteBand from './QuoteBand.svelte'
	import SectionHeader from './SectionHeader.svelte'
	import TheCode from './TheCode.svelte'

	let { themeContent, featuredProducts = [] }: ThemeHomepageProps = $props()

	const content = $derived(themeContent.tempered)
	const catalogue = $derived(page.data?.catalogue ?? { categories: [], collections: [] })
	// Collections under Drops carry an image even when the Engine gives them none (+page.ts).
	const drops = $derived<CatalogueEntry[]>(page.data?.collectionTiles ?? catalogue.collections ?? [])
	// Search results carry Badge and sold-out; the featured feed is the fallback.
	const products = $derived<any[]>((page.data?.homeProducts?.length ? page.data.homeProducts : featuredProducts).slice(0, 4))

	// Choose your seat: the drops first, then the Categories.
	const seats = $derived(
		content
			? [
					...drops.map((entry) => ({ entry, cta: content.seats.collectionCta })),
					...(catalogue.categories as CatalogueEntry[]).map((entry) => ({ entry, cta: content.seats.categoryCta }))
				].map(({ entry, cta }) => {
					const own = content.seats.tiles[entry.slug] ?? {}
					return { title: entry.name, subtitle: own.subtitle ?? entry.description ?? '', image: own.image ?? entry.image, href: entry.link, cta }
				})
			: []
	)

	// The phone carousel's position, for the hairline dots beneath it.
	let seatIndex = $state(0)
	function onSeatScroll(event: Event) {
		const track = event.currentTarget as HTMLElement
		seatIndex = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1))
	}
</script>

{#if content}
	<!-- Hero: the crowned elephant, darkened and fading into the ground on every side, the header
	     floating over its top edge. The copy sits bottom-left on a phone and centred-left from 768px;
	     the values stand at the right on desktop and fold into one line under the buttons on a phone. -->
	<section class="hero relative overflow-hidden" aria-labelledby="home-title">
		<img
			src={content.hero.image}
			srcset="{content.hero.imageSmall} 1000w, {content.hero.image} 2000w"
			sizes="100vw"
			alt={content.hero.imageAlt}
			class="hero__img"
			fetchpriority="high"
		/>
		<div class="hero__scrim" aria-hidden="true"></div>
		<div
			class="page-width relative flex min-h-[760px] flex-col justify-end pb-16 pt-header md:min-h-[920px] md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-12 md:pb-32 md:pt-32 lg:pl-32 lg:pr-16"
		>
			<div class="flex min-w-0 flex-col md:flex-[1_1_520px]">
				<p class="text-eyebrow uppercase text-muted-foreground">{content.hero.eyebrow}</p>
				<h1
					id="home-title"
					class="glint -mr-[0.14em] mb-3 mt-4 whitespace-nowrap font-serif text-display-xl uppercase text-foreground md:mb-6 md:mt-6"
				>
					{content.hero.title}
				</h1>
				<p class="font-serif text-quote italic text-foreground/80">{content.hero.tagline}</p>
				<p class="mt-4 max-w-measure text-body text-muted-foreground md:mt-6">{content.hero.text}</p>
				<div class="mt-8 flex flex-col gap-3 md:mt-12 md:flex-row md:gap-4">
					<LinkButton href={content.hero.href}>{content.hero.cta}</LinkButton>
					<LinkButton href={content.hero.secondaryHref} arrow={false}>{content.hero.secondaryCta}</LinkButton>
				</div>
				<ul class="mt-8 flex flex-wrap gap-x-3 gap-y-2 text-eyebrow uppercase text-faint-foreground md:hidden" aria-label="What we stand for">
					{#each content.hero.values as value, i (value)}
						<li class:text-foreground={i === content.hero.values.length - 1}>{value}</li>
					{/each}
				</ul>
			</div>
			<ul
				class="hidden flex-col items-end gap-6 border-r border-border-strong pr-6 text-right text-eyebrow uppercase text-muted-foreground md:flex"
				aria-label="What we stand for"
			>
				{#each content.hero.values as value, i (value)}
					<li class:text-foreground={i === content.hero.values.length - 1}>{value}</li>
				{/each}
			</ul>
		</div>
	</section>

	<!-- The collection: the featured products as one spotlight. -->
	{#if products.length}
		<section class="page-width pt-16 md:pt-24" aria-labelledby="home-collection">
			<div use:reveal>
				<SectionHeader
					id="home-collection"
					align="center"
					rule={false}
					eyebrow={content.collection.eyebrow}
					title={content.collection.title}
					text={content.collection.text}
				/>
			</div>
			<div class="mt-8 md:mt-12" use:reveal>
				<ProductSpotlight {products} notes={content.collection.notes} viewPiece={content.collection.viewPiece} />
			</div>
			<div class="mt-8 flex justify-center md:mt-16" use:reveal>
				<LinkButton href={content.collection.href} arrow={false} class="w-full md:w-auto">{content.collection.cta}</LinkButton>
			</div>
		</section>
	{/if}

	<!-- Choose your seat: one full-height tile per drop and Category, title bottom-left with an arrow
	     line (design/components/CollectionTile). Three across from 768px with a 4px seam; on a phone,
	     one at a time in a snapping carousel. -->
	{#if seats.length}
		<section id="collections" class="scroll-mt-header pt-16 md:pt-24" aria-labelledby="home-seats">
			<div class="page-width" use:reveal>
				<SectionHeader id="home-seats" align="center" rule={false} eyebrow={content.seats.eyebrow} title={content.seats.title} />
			</div>
			<ul
				class="seats mt-8 flex snap-x snap-mandatory overflow-x-auto md:mt-12 md:grid md:gap-1 md:overflow-visible"
				style="--seat-count: {seats.length}"
				onscroll={onSeatScroll}
			>
				{#each seats as seat (seat.href)}
					<li class="w-full flex-none snap-center" use:reveal>
						<a href={seat.href} class="seat group gap-2 p-8 lg:gap-3 lg:p-12">
							{#if seat.image}
								<img src={seat.image} alt="" class="seat__img" loading="lazy" />
							{/if}
							<span class="seat__scrim" aria-hidden="true"></span>
							<span class="relative font-serif text-title-l uppercase">{seat.title}</span>
							{#if seat.subtitle}
								<span class="relative text-eyebrow uppercase text-muted-foreground">{seat.subtitle}</span>
							{/if}
							<span class="relative mt-2 inline-flex items-center gap-2 text-label uppercase">{seat.cta}<Arrow /></span>
						</a>
					</li>
				{/each}
			</ul>
			{#if seats.length > 1}
				<div class="flex justify-center gap-2 pt-4 md:hidden" aria-hidden="true">
					{#each seats as seat, i (seat.href)}
						<span class="h-px w-4 {i === seatIndex ? 'bg-foreground' : 'bg-border-strong'}"></span>
					{/each}
				</div>
			{/if}
		</section>
	{/if}

	<!-- The Code: five virtues under outlined Roman numerals. -->
	<section class="page-width pt-16 md:pt-24" aria-labelledby="home-code">
		<TheCode id="home-code" eyebrow={content.code.eyebrow} items={content.code.items} link={content.code.link} href={content.code.href} />
	</section>

	<!-- A different breed: image then copy, 50/50 on desktop. -->
	<section class="grid items-center py-16 md:py-32 lg:grid-cols-2" aria-labelledby="home-manifesto">
		<img
			src={content.manifesto.image}
			alt={content.manifesto.imageAlt}
			class="aspect-[4/3] w-full object-cover lg:aspect-[839/723]"
			loading="lazy"
			use:reveal
		/>
		<div class="flex flex-col gap-4 px-[var(--container-gutter)] pt-8 lg:gap-6 lg:px-24 lg:pt-0" use:reveal>
			<p class="text-eyebrow uppercase text-muted-foreground">{content.manifesto.eyebrow}</p>
			<h2 id="home-manifesto" class="font-serif text-display-l uppercase text-foreground [text-wrap:balance]">
				{content.manifesto.title}
			</h2>
			<p class="max-w-measure text-body text-muted-foreground">{content.manifesto.text}</p>
			<LinkButton href={content.manifesto.href} arrow={false} class="mt-2 w-full lg:mt-0 lg:w-auto lg:self-start">{content.manifesto.cta}</LinkButton>
		</div>
	</section>

	<!-- Quote: the crest in moving foil, the line, the sign-off. -->
	<QuoteBand text={content.quote.text} signoff={content.quote.signoff} />
{/if}

<style>
	/* Hero: the photograph darkened and desaturated behind every word, then faded into the ground at
	   the top (under the header), the bottom, and on desktop the left, where the copy sits. */
	.hero__img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 48% 30%;
		filter: brightness(0.34) saturate(0.55) contrast(1.1);
	}

	.hero__scrim {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(
				180deg,
				hsl(var(--background)) 0,
				hsl(var(--background)) 110px,
				hsl(var(--background) / 0.6) 208px,
				hsl(var(--background) / 0) 320px
			),
			linear-gradient(0deg, hsl(var(--background)) 0, hsl(var(--background) / 0) 220px),
			linear-gradient(0deg, hsl(var(--background)) 8%, hsl(var(--background) / 0.55) 50%, hsl(var(--background) / 0.2) 100%);
	}

	@media (min-width: 768px) {
		.hero__img {
			object-position: 58% 40%;
			filter: brightness(0.32) saturate(0.55) contrast(1.1);
		}

		.hero__scrim {
			background:
				linear-gradient(
					180deg,
					hsl(var(--background)) 0,
					hsl(var(--background)) 144px,
					hsl(var(--background) / 0.6) 312px,
					hsl(var(--background) / 0) 480px
				),
				linear-gradient(0deg, hsl(var(--background)) 0, hsl(var(--background) / 0) 260px),
				linear-gradient(90deg, hsl(var(--background) / 0.85) 0%, hsl(var(--background) / 0.55) 45%, hsl(var(--background) / 0.2) 100%);
		}
	}

	/* Choose your seat: a photograph under a bottom scrim, the title bottom-left over an arrow line,
	   the image zooming slowly on hover. Always photographic, so the text is Night's ink. */
	.seats {
		scrollbar-width: none;
	}

	.seats::-webkit-scrollbar {
		display: none;
	}

	@media (min-width: 768px) {
		.seats {
			grid-template-columns: repeat(var(--seat-count), minmax(0, 1fr));
		}
	}

	.seat {
		position: relative;
		display: flex;
		height: 560px;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-end;
		overflow: hidden;
		color: hsl(var(--foreground));
	}

	@media (min-width: 1024px) {
		.seat {
			height: 760px;
		}
	}

	.seat__img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: brightness(0.55) saturate(0.7);
		transition: transform 0.8s var(--motion-ease);
	}

	.seat:hover .seat__img {
		transform: scale(1.04);
	}

	.seat__scrim {
		position: absolute;
		inset: 45% 0 0 0;
		background: linear-gradient(0deg, hsl(var(--background) / 0.92), hsl(var(--background) / 0));
	}

	@media (prefers-reduced-motion: reduce) {
		.seat__img {
			transition: none;
		}

		.seat:hover .seat__img {
			transform: none;
		}
	}
</style>
