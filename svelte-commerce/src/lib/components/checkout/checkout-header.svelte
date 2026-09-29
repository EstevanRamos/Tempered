<script lang="ts">
	import { goto } from '$app/navigation'
	import { appendOneTimeCartId } from '$lib/core/utils/index.js'

	let { step = 1 } = $props()

	// Cart and Address can be revisited until the order is placed; Payment and Placed are reached
	// only by going forward.
	const steps = [
		{ n: 1, label: 'Cart', href: '/checkout/cart' },
		{ n: 2, label: 'Address', href: '/checkout/address' },
		{ n: 3, label: 'Payment', href: '' },
		{ n: 4, label: 'Placed', href: '' }
	]
	const reachable = (n: number, href: string) => !!href && n < step && step < 4
</script>

<!-- The step indicator in uppercase label type: numbered steps on a hairline, the current one in ink.
     Shown on mobile too: it is the only step context and the only way back to cart and address
     there. Below sm only the current step keeps its label so all four fit. -->
<nav aria-label="Checkout steps" class="mb-8 mt-8 md:mb-12 md:mt-12">
	<ol class="flex items-center justify-center gap-3 sm:gap-6">
		{#each steps as { n, label, href }, i (n)}
			{#if i > 0}
				<li aria-hidden="true" class="h-px w-4 bg-border sm:w-10 md:w-16"></li>
			{/if}
			<li>
				<button
					type="button"
					disabled={!reachable(n, href)}
					aria-current={n === step ? 'step' : undefined}
					onclick={() => goto(appendOneTimeCartId(href))}
					class="flex min-h-11 items-center gap-2 border-b text-label uppercase transition-colors disabled:cursor-default {n === step
						? 'border-foreground text-foreground'
						: n < step
							? 'border-transparent text-muted-foreground enabled:hover:text-foreground'
							: 'border-transparent text-faint-foreground'}"
				>
					<span class="tabular-nums">{String(n).padStart(2, '0')}</span>
					<span class={n === step ? '' : 'hidden sm:inline'}>{label}</span>
				</button>
			</li>
		{/each}
	</ol>
</nav>
