<script lang="ts">
	// The crowned elephant as gold foil: the elephant SVG used as a mask over a gold gradient, so it
	// stays crisp at any size and follows the tokens. `shimmer` sweeps a highlight across it (the
	// quote band); reduced motion leaves it still. Size it with a height or width class.
	let { shimmer = false, label = '', class: className = '' }: { shimmer?: boolean; label?: string; class?: string } = $props()
</script>

<span
	class="crest {className}"
	class:crest--shimmer={shimmer}
	role={label ? 'img' : undefined}
	aria-label={label || undefined}
	aria-hidden={label ? undefined : 'true'}
></span>

<style>
	.crest {
		display: block;
		aspect-ratio: 600 / 483;
		-webkit-mask: url('/tempered/tempered%20elephant%20SVG.svg') center / contain no-repeat;
		mask: url('/tempered/tempered%20elephant%20SVG.svg') center / contain no-repeat;
		background: linear-gradient(110deg, hsl(var(--primary-hover)), hsl(var(--primary)) 50%, hsl(var(--primary-hover)));
	}

	.crest--shimmer {
		background: linear-gradient(
			110deg,
			hsl(var(--primary-hover) / 0.7) 0%,
			hsl(var(--primary-hover)) 38%,
			hsl(var(--foreground)) 50%,
			hsl(var(--primary-hover)) 62%,
			hsl(var(--primary-hover) / 0.7) 100%
		);
		background-size: 260% 100%;
		animation: crest-shimmer 5s ease-in-out infinite;
	}

	@keyframes crest-shimmer {
		0% {
			background-position: 120% 0;
		}
		60%,
		100% {
			background-position: -20% 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.crest--shimmer {
			animation: none;
			background-position: 50% 0;
		}
	}
</style>
