<script lang="ts">
	// design/components/ValueList: the brand's virtues in eyebrow type, stacked in a corner. Items are
	// ink-muted; the last, the conclusion, is lit in ink. At most once per viewport, never navigation.
	let { items, align = 'end', label, class: className = '' }: { items: string[]; align?: 'start' | 'end'; label: string; class?: string } = $props()
</script>

<ul
	class="m-0 flex list-none flex-col gap-2 p-0 text-eyebrow uppercase text-muted-foreground [&>li:last-child]:text-foreground {align === 'end'
		? 'items-end text-right'
		: 'items-start'} {className}"
	aria-label={label}
>
	{#each items as item (item)}
		<li>{item}</li>
	{/each}
</ul>
