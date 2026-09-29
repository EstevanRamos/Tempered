<script lang="ts">
	// design/components/Button as a link, `outline` (an ink hairline that fills with ink on hover) or
	// `solid`, 48px, uppercase label type, square, with the arrow for forward motion.
	import type { Snippet } from 'svelte'
	import Arrow from './Arrow.svelte'

	let { href, children, variant = 'outline' }: { href: string; children: Snippet; variant?: 'outline' | 'solid' } = $props()
</script>

<a
	{href}
	class="group inline-flex h-12 items-center gap-3 border border-foreground px-8 text-label uppercase transition-colors duration-200 {variant === 'solid'
		? 'bg-foreground text-background hover:bg-transparent hover:text-foreground'
		: 'text-foreground hover:bg-foreground hover:text-background'}"
>
	{@render children()}
	<Arrow />
</a>
