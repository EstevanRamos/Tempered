<script lang="ts">
	// design/components/TextLink: tracked uppercase with the hairline arrow, a hairline underline in
	// currentColor on hover. `muted` for utility links.
	import type { Snippet } from 'svelte'
	import Arrow from './Arrow.svelte'

	let { href, children, muted = false, arrow = true }: { href: string; children: Snippet; muted?: boolean; arrow?: boolean } = $props()
</script>

<a
	{href}
	class="group inline-flex items-center gap-2 whitespace-nowrap border-b border-transparent py-1 text-label uppercase transition-colors duration-200 hover:border-current {muted
		? 'text-muted-foreground'
		: 'text-foreground'}"
>
	{@render children()}
	{#if arrow}<Arrow />{/if}
</a>
