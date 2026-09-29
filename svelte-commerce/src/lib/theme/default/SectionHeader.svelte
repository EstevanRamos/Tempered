<script lang="ts">
	// design/components/SectionHeader: an optional eyebrow, the title in the display serif (uppercase,
	// tracked), a 32px gold rule beneath unless `rule={false}`, an optional lead line, and an optional
	// trailing link.
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
			class="font-serif text-[28px] font-medium uppercase leading-[34px] tracking-[0.08em] text-foreground [text-wrap:balance] md:text-heading"
		>
			{title}
		</svelte:element>
		{#if rule}
			<span class="mt-4 block h-px w-8 bg-primary" aria-hidden="true"></span>
		{/if}
		{#if text}
			<p class="mt-3 max-w-[460px] text-[14px] leading-[1.6] text-muted-foreground md:mt-5 md:text-body">{text}</p>
		{/if}
	</div>
	{@render action?.()}
</div>
