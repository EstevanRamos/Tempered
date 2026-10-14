<script lang="ts">
	// The Our Story page: a Story page, not a product group (CONTEXT.md). The homepage's Our Story
	// tile and the footer link here. Copy is the default theme's content (`tempered.story`), in the
	// design system's voice; it ends with the way back into the shop. The virtues and the quote are
	// the homepage's own bands (TheCode, QuoteBand), so the brand content reads the same on both.
	import { page } from '$app/state'
	import SeoHeader from '$lib/components/seo/seo-header.svelte'
	import { resolveThemeContent } from '$lib/theme/index.js'
	import SectionHeader from '$lib/theme/default/SectionHeader.svelte'
	import TheCode from '$lib/theme/default/TheCode.svelte'
	import QuoteBand from '$lib/theme/default/QuoteBand.svelte'
	import TextLink from '$lib/theme/default/TextLink.svelte'
	import LinkButton from '$lib/theme/default/LinkButton.svelte'

	const tempered = $derived(resolveThemeContent('default', page.data?.store)?.tempered)
	const story = $derived(tempered?.story)
	const storeName = $derived(page.data?.store?.name || 'Tempered')
	const collections = $derived<{ name: string; link: string }[]>(page.data?.catalogue?.collections ?? [])
</script>

{#if story}
	<SeoHeader
		metaTitle="{story.seoTitle} | {storeName}"
		metaDescription={story.seoDescription}
		image={story.hero.image}
		canonicalUrl={page.url.origin + page.url.pathname}
	/>

	<!-- Opening: the word defined like a dictionary entry on the ground, the image beside it (below it
	     on a phone). Headword, pronunciation and part of speech, numbered senses between hairlines, a
	     usage line in the italic serif, the origin in small type. The headword glints like the homepage
	     title: the opening's one gold element. -->
	<section class="grid border-b border-border lg:grid-cols-[5fr_7fr]" aria-labelledby="story-title">
		<div class="page-width flex flex-col justify-center py-16 lg:w-auto lg:py-32 lg:pl-[var(--container-gutter)] lg:pr-16">
			<p class="text-eyebrow uppercase text-muted-foreground">{story.hero.eyebrow}</p>
			<div class="mt-6 max-w-measure">
				<div>
					<h1 id="story-title" class="glint font-serif text-display-l uppercase text-foreground">{story.hero.word}</h1>
					<p class="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
						<span class="font-serif text-quote italic text-muted-foreground">{story.hero.pronunciation}</span>
						<span class="text-eyebrow uppercase text-faint-foreground">{story.hero.partOfSpeech}</span>
					</p>
				</div>
				<div class="mt-8">
					<ol class="border-t border-border">
						{#each story.hero.senses as sense, i (sense)}
							<li class="grid grid-cols-[theme(spacing.8)_1fr] border-b border-border py-4">
								<span class="text-label tabular-nums text-faint-foreground">{i + 1}.</span>
								<span class="text-body-l text-foreground">{sense}</span>
							</li>
						{/each}
					</ol>
					<p class="mt-6 font-serif text-quote italic text-muted-foreground">“{story.hero.example}”</p>
					<p class="mt-4 text-small text-faint-foreground">{story.hero.origin}</p>
				</div>
			</div>
		</div>
		<img src={story.hero.image} alt={story.hero.imageAlt} class="aspect-[4/3] h-full w-full object-cover object-[50%_20%] lg:aspect-auto lg:min-h-[560px]" />
	</section>

	<!-- The virtues, as The Code. The chapters stand between it and the quote, so its numerals and the
	     quote's crest never share a view (one gold element per view). -->
	{#if tempered?.code}
		<section class="page-width py-16 md:py-24" aria-labelledby="story-code">
			<TheCode id="story-code" eyebrow={tempered.code.eyebrow} items={tempered.code.items} />
		</section>
	{/if}

	<!-- Chapters: image and copy side by side, alternating; image then copy on a phone. -->
	{#each story.chapters as chapter, i (chapter.title)}
		<section class="grid border-t border-border lg:grid-cols-2" aria-labelledby="story-chapter-{i}">
			<img
				src={chapter.image}
				alt={chapter.imageAlt}
				loading="lazy"
				class="aspect-[4/3] h-full w-full object-cover lg:aspect-auto lg:min-h-[520px] {i % 2 ? 'lg:order-2' : ''}"
			/>
			<div class="flex flex-col justify-center gap-6 px-4 py-16 sm:px-8 lg:px-16 lg:py-24">
				<SectionHeader id="story-chapter-{i}" rule={false} eyebrow={chapter.eyebrow} title={chapter.title} />
				{#each chapter.text as paragraph (paragraph)}
					<p class="max-w-measure text-body text-muted-foreground">{paragraph}</p>
				{/each}
			</div>
		</section>
	{/each}

	<!-- The line the story comes to. -->
	<QuoteBand text={story.quote.text} signoff={story.quote.signoff} />

	<!-- The way back into the shop. -->
	<section class="border-t border-border bg-card" aria-labelledby="story-close">
		<div class="page-width flex flex-col gap-10 py-16 md:flex-row md:items-end md:justify-between md:py-24">
			<div class="flex flex-col gap-6">
				<SectionHeader id="story-close" rule={false} eyebrow={story.close.eyebrow} title={story.close.title} />
				<p class="max-w-measure text-body text-muted-foreground">{story.close.text}</p>
			</div>
			<div class="flex flex-wrap items-center gap-8">
				<LinkButton href={story.close.href}>{story.close.cta}</LinkButton>
				{#each collections as collection (collection.link)}
					<TextLink href={collection.link}>{collection.name} drop</TextLink>
				{/each}
			</div>
		</div>
	</section>
{/if}
