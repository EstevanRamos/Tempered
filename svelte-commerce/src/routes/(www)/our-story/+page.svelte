<script lang="ts">
	// The Our Story page: a Story page, not a product group (CONTEXT.md). The homepage's Our Story
	// tile and the footer link here. Copy is the default theme's content (`tempered.story`), in the
	// design system's voice; it ends with the way back into the shop.
	import { page } from '$app/state'
	import SeoHeader from '$lib/components/seo/seo-header.svelte'
	import { resolveThemeContent } from '$lib/theme/index.js'
	import SectionHeader from '$lib/theme/default/SectionHeader.svelte'
	import ValueList from '$lib/theme/default/ValueList.svelte'
	import TextLink from '$lib/theme/default/TextLink.svelte'
	import LinkButton from '$lib/theme/default/LinkButton.svelte'

	const story = $derived(resolveThemeContent('default', page.data?.store)?.tempered?.story)
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

	<!-- Opening: the statement on the ground, the image beside it (below it on a phone). -->
	<section class="grid border-b border-border lg:grid-cols-[5fr_7fr]" aria-labelledby="story-title">
		<div class="page-width flex flex-col justify-center py-16 lg:w-auto lg:py-32 lg:pl-[var(--container-gutter)] lg:pr-16">
			<p class="text-eyebrow uppercase text-muted-foreground">{story.hero.eyebrow}</p>
			<h1
				id="story-title"
				class="mb-6 mt-4 max-w-[12ch] font-serif text-[40px] font-normal uppercase leading-[44px] tracking-[0.1em] text-foreground lg:text-display-l"
			>
				{story.hero.title}
			</h1>
			<p class="max-w-measure text-body-l text-muted-foreground">{story.hero.text}</p>
		</div>
		<img src={story.hero.image} alt={story.hero.imageAlt} class="aspect-[4/3] h-full w-full object-cover object-[50%_20%] lg:aspect-auto lg:min-h-[560px]" />
	</section>

	<!-- Chapters: image and copy side by side, alternating; image then copy on a phone. -->
	{#each story.chapters as chapter, i (chapter.title)}
		<section class="grid border-b border-border lg:grid-cols-2" aria-labelledby="story-chapter-{i}">
			<img
				src={chapter.image}
				alt={chapter.imageAlt}
				loading="lazy"
				class="aspect-[4/3] h-full w-full object-cover lg:aspect-auto lg:min-h-[520px] {i % 2 ? 'lg:order-2' : ''}"
			/>
			<div class="flex flex-col justify-center gap-6 px-4 py-16 sm:px-8 lg:px-16 lg:py-24">
				<SectionHeader id="story-chapter-{i}" eyebrow={chapter.eyebrow} title={chapter.title} />
				{#each chapter.text as paragraph (paragraph)}
					<p class="max-w-measure text-body text-muted-foreground">{paragraph}</p>
				{/each}
			</div>
		</section>
	{/each}

	<!-- The virtues and the line they come to. -->
	<section class="page-width grid items-end gap-12 py-24 md:grid-cols-[1fr_auto] md:py-32" aria-label="Play with purpose">
		<figure>
			<img src="/tempered/mark.png" alt="" class="h-[72px] w-auto" loading="lazy" />
			<blockquote class="mb-4 mt-8 max-w-[720px] font-serif text-[28px] italic leading-[38px] text-foreground md:text-[40px] md:leading-[52px]">
				“{story.quote.text}”
			</blockquote>
			<figcaption class="text-eyebrow uppercase text-primary">{story.quote.signoff}</figcaption>
		</figure>
		<ValueList items={story.values} label="The virtues" />
	</section>

	<!-- The way back into the shop. -->
	<section class="border-t border-border bg-card" aria-labelledby="story-close">
		<div class="page-width flex flex-col gap-10 py-16 md:flex-row md:items-end md:justify-between md:py-24">
			<div class="flex flex-col gap-6">
				<SectionHeader id="story-close" eyebrow={story.close.eyebrow} title={story.close.title} />
				<p class="max-w-measure text-body text-muted-foreground">{story.close.text}</p>
			</div>
			<div class="flex flex-wrap items-center gap-8">
				<LinkButton href={story.close.href}>{story.close.cta}</LinkButton>
				{#each collections as collection (collection.link)}
					<TextLink href={collection.link}>{collection.name} collection</TextLink>
				{/each}
			</div>
		</div>
	</section>
{/if}
