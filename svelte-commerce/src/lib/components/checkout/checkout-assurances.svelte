<script lang="ts">
	// Reassurance under the order summary. On Tempered, the same shipping, returns and payment lines
	// the product page shows beside Add to bag, in words with a 1px-stroke icon. Other themes keep the
	// package's trust badges.
	import { page } from '$app/state'
	import { RotateCcw, ShieldCheck, Truck } from '@lucide/svelte'
	import OrderTrustBadges from '$lib/core/components/plugins/order-trust-badges.svelte'
	import { resolveThemeContent } from '$lib/theme/index.js'

	const tempered = $derived((page.data?.theme?.name ?? 'default') === 'default')
	const assurances = $derived(tempered ? (resolveThemeContent('default', page.data?.store)?.tempered?.assurances ?? []) : [])
	const ICONS = { truck: Truck, returns: RotateCcw, shield: ShieldCheck }
</script>

{#if tempered}
	<ul class="flex flex-col gap-3 border-t border-border pt-5" aria-label="Shipping, returns and payment">
		{#each assurances as item (item.title)}
			{@const Icon = ICONS[item.icon] ?? ShieldCheck}
			<li class="flex items-start gap-3">
				<Icon class="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={1} aria-hidden="true" />
				<p class="text-small text-muted-foreground">
					<span class="text-eyebrow uppercase text-foreground">{item.title}</span>
					<span class="mt-0.5 block">{item.text}</span>
				</p>
			</li>
		{/each}
	</ul>
{:else}
	<OrderTrustBadges />
{/if}
