<script lang="ts">
	// design/components/TheCode: the virtues under outlined Roman numerals, the numerals drawn as a
	// gold-deep hairline in Bodoni (together, the view's one gold element). A list on a phone, five
	// columns from 1024px, an eyebrow head with an optional muted link. The homepage and Our Story
	// both show it.
	import { reveal } from '$lib/actions/reveal.js'
	import TextLink from './TextLink.svelte'

	type Virtue = { numeral: string; title: string; text: string }

	let {
		eyebrow,
		items,
		id,
		link = '',
		href = ''
	}: { eyebrow: string; items: Virtue[]; id: string; link?: string; href?: string } = $props()
</script>

<div class="mb-6 flex items-baseline justify-between gap-4 lg:mb-12" use:reveal>
	<h2 {id} class="font-sans text-eyebrow uppercase text-muted-foreground">{eyebrow}</h2>
	{#if link && href}<TextLink {href} muted>{link}</TextLink>{/if}
</div>
<ol class="grid grid-cols-1 lg:grid-cols-5 lg:gap-6">
	{#each items as item (item.numeral)}
		<li
			use:reveal
			class="grid grid-cols-[theme(spacing.16)_1fr] items-baseline gap-x-3 gap-y-1 border-t border-border py-6 lg:flex lg:flex-col lg:gap-4 lg:pb-0"
		>
			<span class="numeral row-span-2 font-numeral text-numeral lg:text-numeral-l" aria-hidden="true">{item.numeral}</span>
			<h3 class="font-sans text-eyebrow uppercase text-foreground lg:text-label">{item.title}</h3>
			<p class="text-body text-faint-foreground max-lg:col-start-2">{item.text}</p>
		</li>
	{/each}
</ol>

<style>
	/* Outlined in gold-deep, no fill. */
	.numeral {
		color: transparent;
		-webkit-text-stroke: 0.8px hsl(var(--primary-hover));
		font-variation-settings: 'opsz' 96;
	}
</style>
