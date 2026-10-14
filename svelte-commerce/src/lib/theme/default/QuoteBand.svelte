<script lang="ts">
	// design/components/QuoteBand: the crest in moving gold foil (the band's one gold element), the
	// line in the italic display serif, and the sign-off in eyebrow type. Centred, on the ground. The
	// homepage and Our Story both close their brand content with it.
	import { reveal } from '$lib/actions/reveal.js'
	import Crest from './Crest.svelte'

	let { text, signoff }: { text: string; signoff: string } = $props()
</script>

<figure class="flex flex-col items-center gap-6 px-6 py-16 text-center md:py-24 lg:gap-8">
	<div use:reveal><Crest shimmer class="w-36 lg:w-64" /></div>
	<blockquote use:reveal class="max-w-[18em] font-serif text-quote-l italic text-foreground [text-wrap:balance]">
		“{text}”
	</blockquote>
	<figcaption use:reveal class="text-eyebrow uppercase text-muted-foreground">{signoff}</figcaption>
</figure>
