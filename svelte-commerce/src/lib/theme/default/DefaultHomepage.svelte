<script lang="ts">
	// Tempered's homepage (the 2026-09 redesign), band by band: the hero under a floating header, the
	// collection spotlight, Choose your seat, The Code, the manifesto and the quote. Copy is the theme
	// content's `tempered` block; Collections, Categories and products come from the Engine. A band
	// with nothing real to show is left out rather than filled with placeholders.
	import { page } from '$app/state'
	import { reveal } from '$lib/actions/reveal.js'
	import type { ThemeHomepageProps } from '../homepages.js'
	import type { CatalogueEntry } from './catalogue-tree.js'
	import Crest from './Crest.svelte'
	import LinkButton from './LinkButton.svelte'
	import ProductSpotlight from './ProductSpotlight.svelte'
	import SectionHeader from './SectionHeader.svelte'
	import TextLink from './TextLink.svelte'

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
			? [...drops, ...(catalogue.categories as CatalogueEntry[])].map((entry) => {
					const own = content.seats.tiles[entry.slug] ?? {}
					return { title: entry.name, subtitle: own.subtitle ?? entry.description ?? '', image: own.image ?? entry.image, href: entry.link }
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
			class="page-width relative flex min-h-[760px] flex-col justify-end pb-14 pt-[76px] md:min-h-[920px] md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-12 md:pb-0 md:pt-0 lg:pl-[clamp(0px,11vw,192px)] lg:pr-[clamp(0px,6vw,88px)]"
		>
			<div class="flex min-w-0 max-w-[720px] flex-col md:flex-[1_1_520px]">
				<p class="text-eyebrow uppercase text-muted-foreground">{content.hero.eyebrow}</p>
				<h1
					id="home-title"
					class="-mr-[0.12em] mb-3.5 mt-[18px] whitespace-nowrap font-serif text-[58px] font-normal uppercase leading-none tracking-[0.12em] text-foreground md:mb-6 md:mt-7 md:text-[clamp(56px,9vw,132px)] md:tracking-[0.14em]"
				>
					{content.hero.title}
				</h1>
				<p class="font-serif text-[21px] italic leading-tight text-foreground/80 md:text-[26px]">{content.hero.tagline}</p>
				<p class="mt-[18px] max-w-[470px] text-[14px] leading-[1.6] text-muted-foreground md:mt-7 md:text-body">{content.hero.text}</p>
				<div class="mt-8 flex flex-col gap-2.5 md:mt-10 md:flex-row md:gap-4">
					<LinkButton href={content.hero.href} variant="gold" class="h-[52px] md:h-12">{content.hero.cta}</LinkButton>
					<LinkButton href={content.hero.secondaryHref} arrow={false}>{content.hero.secondaryCta}</LinkButton>
				</div>
				<ul
					class="mt-9 flex flex-wrap gap-x-3.5 gap-y-1.5 text-eyebrow uppercase tracking-[0.28em] text-faint-foreground md:hidden"
					aria-label="What we stand for"
				>
					{#each content.hero.values as value, i (value)}
						<li class:text-foreground={i === content.hero.values.length - 1}>{value}</li>
					{/each}
				</ul>
			</div>
			<ul
				class="hidden flex-col items-end gap-[22px] border-r border-border-strong pr-6 text-right text-eyebrow uppercase tracking-[0.3em] text-muted-foreground md:mt-[120px] md:flex"
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
		<section class="page-width pt-[88px] md:pt-[140px]" aria-labelledby="home-collection">
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
			<div class="mt-9 md:mt-14" use:reveal>
				<ProductSpotlight {products} notes={content.collection.notes} viewPiece={content.collection.viewPiece} />
			</div>
			<div class="mt-9 flex justify-center md:mt-[72px]" use:reveal>
				<LinkButton href={content.collection.href} arrow={false} class="w-full md:w-auto">{content.collection.cta}</LinkButton>
			</div>
		</section>
	{/if}

	<!-- Choose your seat: one full-height tile per drop and Category. Three across from 768px; on a
	     phone, one at a time in a snapping carousel. -->
	{#if seats.length}
		<section id="collections" class="scroll-mt-20 pt-[104px] md:pt-[140px]" aria-labelledby="home-seats">
			<div class="page-width" use:reveal>
				<SectionHeader id="home-seats" align="center" rule={false} eyebrow={content.seats.eyebrow} title={content.seats.title} />
			</div>
			<ul
				class="seats mt-8 flex snap-x snap-mandatory overflow-x-auto md:mt-14 md:grid md:overflow-visible"
				style="--seat-count: {seats.length}"
				onscroll={onSeatScroll}
			>
				{#each seats as seat (seat.href)}
					<li class="w-full flex-none snap-center" use:reveal>
						<a href={seat.href} class="seat group">
							{#if seat.image}
								<img src={seat.image} alt="" class="seat__img" loading="lazy" />
							{/if}
							<span class="seat__scrim" aria-hidden="true"></span>
							<span class="relative font-serif text-[32px] uppercase leading-tight tracking-[0.14em] lg:text-[40px]">{seat.title}</span>
							{#if seat.subtitle}
								<span class="relative text-eyebrow uppercase tracking-[0.24em] text-muted-foreground">{seat.subtitle}</span>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
			{#if seats.length > 1}
				<div class="flex justify-center gap-1.5 pt-4 md:hidden" aria-hidden="true">
					{#each seats as seat, i (seat.href)}
						<span class="h-px w-[18px] {i === seatIndex ? 'bg-primary' : 'bg-border-strong'}"></span>
					{/each}
				</div>
			{/if}
		</section>
	{/if}

	<!-- The Code: five virtues under outlined Roman numerals. A list on a phone, five columns on desktop. -->
	<section class="page-width pt-[104px] lg:pt-40" aria-labelledby="home-code">
		<div class="mb-6 flex items-baseline justify-between gap-4 lg:mb-10" use:reveal>
			<h2 id="home-code" class="font-sans text-eyebrow uppercase text-muted-foreground">{content.code.eyebrow}</h2>
			<TextLink href={content.code.href} muted>{content.code.link}</TextLink>
		</div>
		<ol class="grid grid-cols-1 lg:grid-cols-5 lg:gap-5">
			{#each content.code.items as item (item.numeral)}
				<li
					use:reveal
					class="grid grid-cols-[64px_1fr] items-baseline gap-x-3 gap-y-1 border-t border-border py-5 lg:flex lg:flex-col lg:gap-4 lg:pb-0 lg:pt-6"
				>
					<span class="numeral row-span-2 font-numeral text-[44px] leading-[.9] lg:text-[76px]" aria-hidden="true">{item.numeral}</span>
					<h3 class="font-sans text-eyebrow uppercase tracking-[0.28em] text-foreground lg:text-label lg:tracking-[0.28em]">{item.title}</h3>
					<p class="max-w-[220px] text-[14px] leading-[1.55] text-faint-foreground max-lg:col-start-2 max-lg:max-w-none">{item.text}</p>
				</li>
			{/each}
		</ol>
	</section>

	<!-- A different breed: image then copy, 50/50 on desktop. -->
	<section class="grid items-center pb-24 pt-14 lg:grid-cols-2 lg:pb-[140px] lg:pt-24" aria-labelledby="home-manifesto">
		<img
			src={content.manifesto.image}
			alt={content.manifesto.imageAlt}
			class="aspect-[4/3] w-full object-cover lg:aspect-[839/723]"
			loading="lazy"
			use:reveal
		/>
		<div class="flex flex-col gap-[18px] px-4 pt-9 sm:px-8 lg:gap-6 lg:px-[clamp(32px,8vw,120px)] lg:pt-0" use:reveal>
			<p class="text-eyebrow uppercase text-muted-foreground">{content.manifesto.eyebrow}</p>
			<h2
				id="home-manifesto"
				class="font-serif text-[36px] font-normal uppercase leading-[1.05] tracking-[0.06em] text-foreground [text-wrap:balance] lg:text-[52px]"
			>
				{content.manifesto.title}
			</h2>
			<p class="max-w-[420px] text-[14px] leading-[1.6] text-muted-foreground md:text-body">{content.manifesto.text}</p>
			<LinkButton href={content.manifesto.href} arrow={false} class="mt-2 w-full lg:mt-0 lg:w-auto lg:self-start">{content.manifesto.cta}</LinkButton>
		</div>
	</section>

	<!-- Quote: the crest in moving foil on a low gold glow, the line, the sign-off. -->
	<figure class="quote relative flex flex-col items-center gap-6 overflow-hidden px-6 py-24 text-center lg:gap-10 lg:py-40">
		<div class="relative" use:reveal><Crest shimmer class="w-[150px] lg:w-[260px]" /></div>
		<blockquote
			use:reveal
			class="relative max-w-[760px] font-serif text-[28px] italic leading-[1.2] text-foreground [text-wrap:balance] lg:text-[44px]"
		>
			“{content.quote.text}”
		</blockquote>
		<figcaption use:reveal class="relative text-eyebrow uppercase text-primary-hover">{content.quote.signoff}</figcaption>
	</figure>
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

	/* Choose your seat: a photograph under a bottom scrim, the title centred at the foot, the image
	   zooming slowly on hover. Always photographic, so the text is Night's ink. */
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
		align-items: center;
		justify-content: flex-end;
		gap: 10px;
		overflow: hidden;
		padding: 32px 16px;
		text-align: center;
		color: hsl(var(--foreground));
	}

	@media (min-width: 1024px) {
		.seat {
			height: 760px;
			gap: 14px;
			padding: 48px 24px;
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

	/* The Code's numerals: outlined in gold-deep, no fill. */
	.numeral {
		color: transparent;
		-webkit-text-stroke: 0.8px hsl(var(--primary-hover));
		font-variation-settings: 'opsz' 96;
	}

	/* The quote's low gold glow, centred on the crest and line. */
	.quote::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(
			ellipse closest-side at 50% 45%,
			hsl(var(--primary-hover) / 0.16),
			hsl(var(--primary-hover) / 0.05) 50%,
			hsl(var(--primary-hover) / 0) 100%
		);
		pointer-events: none;
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
