<script lang="ts">
	// design/components/Badge: a 20px hairline tag in uppercase tracked type, the only element with
	// `radius-hair`. The word carries the meaning; the tone only reinforces it.
	import type { BadgeTone } from './product-badge.js'

	let { label, tone = 'neutral', class: className = '', id }: { label: string; tone?: BadgeTone; class?: string; id?: string } = $props()

	const TONES: Record<BadgeTone, string> = {
		neutral: 'border-foreground bg-background text-foreground',
		gold: 'border-primary bg-primary text-primary-foreground',
		positive: 'border-success text-success',
		danger: 'border-destructive bg-background text-destructive'
	}
</script>

<span {id} class="inline-flex h-5 items-center rounded-[2px] border px-2 text-[10px] font-medium uppercase leading-none tracking-[0.2em] {TONES[tone]} {className}">
	{label}
</span>
