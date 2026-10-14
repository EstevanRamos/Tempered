<script lang="ts">
	// design/components/SectionHeader: an optional eyebrow, the title in the display serif (uppercase,
	// tracked), a 32px gold rule beneath unless `rule={false}` (the homepage's bands drop it: their gold
	// moments are elsewhere), an optional `text` lead, and an optional trailing link.
	import type { Snippet } from 'svelte'

	let {
		title,
		eyebrow = '',
		text = '',
		id,
		as = 'h2',
		align = 'start',
		rule = true,
		action
	}: {
		title: string
		eyebrow?: string
		text?: string
		id?: string
		as?: 'h1' | 'h2'
		align?: 'start' | 'center'
		rule?: boolean
		action?: Snippet
	} = $props()
</script>

<div class="flex gap-8 {align === 'center' ? 'flex-col items-center text-center' : 'items-end justify-between'}">
	<div class="flex flex-col {align === 'center' ? 'items-center' : ''}">
		{#if eyebrow}
			<p class="mb-3 text-eyebrow uppercase text-muted-foreground md:mb-5">{eyebrow}</p>
		{/if}
		<svelte:element
			this={as}
			{id}
			class="font-serif text-heading uppercase text-foreground [text-wrap:balance]"
		>
			{title}
		</svelte:element>
		{#if rule}
			<span class="mt-4 block h-px w-8 bg-primary" aria-hidden="true"></span>
		{/if}
		{#if text}
			<p class="mt-3 max-w-measure text-body text-muted-foreground md:mt-6">{text}</p>
		{/if}
	</div>
	{@render action?.()}
</div>
