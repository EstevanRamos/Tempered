<script lang="ts">
	// design/components/Button as a link, `outline` (an ink hairline that fills with ink on hover),
	// `solid`, or `gold` (the view's one gold action, deepening on hover), 48px, uppercase label type,
	// square, with the arrow for forward motion unless `arrow={false}`.
	import type { Snippet } from 'svelte'
	import Arrow from './Arrow.svelte'

	let {
		href,
		children,
		variant = 'outline',
		arrow = true,
		class: className = ''
	}: { href: string; children: Snippet; variant?: 'outline' | 'solid' | 'gold'; arrow?: boolean; class?: string } = $props()

	const variants = {
		outline: 'border-foreground text-foreground hover:bg-foreground hover:text-background',
		solid: 'border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground',
		gold: 'border-primary bg-primary text-primary-foreground hover:border-primary-hover hover:bg-primary-hover'
	}
</script>

<a
	{href}
	class="group inline-flex h-12 items-center justify-center gap-3 border px-8 text-label uppercase transition-colors duration-200 {variants[
		variant
	]} {className}"
>
	{@render children()}
	{#if arrow}<Arrow />{/if}
</a>
