<script lang="ts">
	// design/components/CollectionTile: a photograph under a bottom scrim, the name bottom-left in
	// `title-l`, a tracked subtitle and an arrow line, the image zooming slowly on hover. Always
	// photographic, so the text is Night's ink. Tall by default (Choose your seat, the Drops page);
	// size it with `class`.
	import Arrow from './Arrow.svelte'

	let {
		href,
		title,
		subtitle = '',
		image = '',
		cta,
		class: className = 'h-[560px] lg:h-[760px]'
	}: { href: string; title: string; subtitle?: string; image?: string | null; cta: string; class?: string } = $props()
</script>

<a {href} class="tile group gap-2 p-8 lg:gap-3 lg:p-12 {className}">
	{#if image}
		<img src={image} alt="" class="tile__img" loading="lazy" />
	{/if}
	<span class="tile__scrim" aria-hidden="true"></span>
	<span class="relative font-serif text-title-l uppercase">{title}</span>
	{#if subtitle}
		<span class="relative text-eyebrow uppercase text-muted-foreground">{subtitle}</span>
	{/if}
	<span class="relative mt-2 inline-flex items-center gap-2 text-label uppercase">{cta}<Arrow /></span>
</a>

<style>
	.tile {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-end;
		overflow: hidden;
		background: hsl(var(--card));
		color: hsl(var(--foreground));
	}

	.tile__img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: brightness(0.55) saturate(0.7);
		transition: transform 0.8s var(--motion-ease);
	}

	.tile:hover .tile__img {
		transform: scale(1.04);
	}

	.tile__scrim {
		position: absolute;
		inset: 45% 0 0 0;
		background: linear-gradient(0deg, hsl(var(--background) / 0.92), hsl(var(--background) / 0));
	}

	@media (prefers-reduced-motion: reduce) {
		.tile__img {
			transition: none;
		}

		.tile:hover .tile__img {
			transform: none;
		}
	}
</style>
