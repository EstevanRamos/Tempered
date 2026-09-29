<script lang="ts">
	// The design system's one glyph: the hairline arrow, 16×10, 1px stroke, currentColor. It nudges
	// 4px right when its link or button (a `group`) is hovered.
	let { class: className = '' }: { class?: string } = $props()
</script>

<svg
	class="shrink-0 transition-transform duration-[240ms] ease-standard group-hover:translate-x-1 motion-reduce:transition-none {className}"
	viewBox="0 0 16 10"
	width="16"
	height="10"
	aria-hidden="true"
>
	<path d="M0 5h14.5M10.5 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1" />
</svg>
