<script lang="ts">
	// design/components/SectionHeader: an optional eyebrow, the title in the display serif (uppercase,
	// tracked), a 32px gold rule beneath, and an optional trailing link.
	import type { Snippet } from 'svelte'

	let {
		title,
		eyebrow = '',
		id,
		as = 'h2',
		align = 'start',
		action
	}: { title: string; eyebrow?: string; id?: string; as?: 'h1' | 'h2'; align?: 'start' | 'center'; action?: Snippet } = $props()
</script>

<div class="flex gap-8 {align === 'center' ? 'flex-col items-center text-center' : 'items-end justify-between'}">
	<div class="flex flex-col {align === 'center' ? 'items-center' : ''}">
		{#if eyebrow}
			<p class="mb-3 text-eyebrow uppercase text-muted-foreground">{eyebrow}</p>
		{/if}
		<svelte:element this={as} {id} class="font-serif text-[28px] font-medium uppercase leading-[34px] tracking-[0.08em] text-foreground md:text-heading">
			{title}
		</svelte:element>
		<span class="mt-4 block h-px w-8 bg-primary" aria-hidden="true"></span>
	</div>
	{@render action?.()}
</div>
