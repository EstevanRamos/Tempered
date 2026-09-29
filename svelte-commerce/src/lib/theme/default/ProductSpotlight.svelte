<script lang="ts">
	// The featured products as one spotlight: a large square image of the chosen piece, its name,
	// price and a line beneath, a gold-underlined link to it, and a thumbnail per product to choose
	// another. Phones stack it all; from 1024px the image takes columns 3–7 and the rest sits in a
	// narrow column at 9–10.
	import { page } from '$app/state'
	import { getImageCDNUrl } from '@misiki/kitcommerce-core/utils'
	import TextLink from './TextLink.svelte'
	import { productPrice } from './product-price.js'

	let { products, notes = {}, viewPiece }: { products: any[]; notes?: Record<string, string>; viewPiece: string } = $props()

	const currencyCode = $derived(page?.data?.store?.currency?.code)
	let active = $state(0)

	const items = $derived(
		products.map((product) => ({
			id: product?.id,
			name: product?.title || product?.name || '',
			href: `/products/${product?.slug}`,
			image: product?.thumbnail || product?.image_url || product?.featuredImage || '',
			price: productPrice(product, currencyCode),
			note: notes[product?.slug] ?? ''
		}))
	)
	const spot = $derived(items[Math.min(active, items.length - 1)])
</script>

{#if spot}
	<div class="grid grid-cols-1 lg:grid-cols-12 lg:items-center lg:gap-x-5">
		<!-- Also reachable as "View piece"; the image is a pointer shortcut, so it stays out of the tab order. -->
		<a href={spot.href} class="block aspect-square bg-card lg:col-span-5 lg:col-start-3" tabindex="-1" aria-hidden="true">
			{#if spot.image}
				<img src={getImageCDNUrl(spot.image, 1000, 0)} alt="" class="h-full w-full object-contain" loading="lazy" decoding="async" />
			{/if}
		</a>

		<div class="flex flex-col lg:col-span-2 lg:col-start-9">
			<div aria-live="polite">
				<div
					class="mt-[18px] flex items-baseline justify-between gap-3 border-t border-border pt-4 text-label uppercase tracking-[0.22em] lg:mt-0 lg:pt-[18px]"
				>
					<span>{spot.name}</span>
					<span class="whitespace-nowrap text-price tabular-nums text-muted-foreground">{spot.price}</span>
				</div>
				<div class="mt-2 flex items-baseline justify-between gap-4 lg:mt-2.5 lg:flex-col lg:items-start lg:gap-5">
					{#if spot.note}<p class="text-small text-faint-foreground">{spot.note}</p>{/if}
					<TextLink href={spot.href} accent>{viewPiece}<span class="sr-only">: {spot.name}</span></TextLink>
				</div>
			</div>

			<div class="mt-6 grid grid-cols-4 gap-2 lg:mt-14 lg:grid-cols-2 lg:gap-3.5" role="group" aria-label="Choose a piece">
				{#each items as item, i (item.id)}
					<button
						type="button"
						class="aspect-[3/4] border-b bg-card transition-opacity duration-200 hover:opacity-100 {i === active
							? 'border-primary'
							: 'border-transparent opacity-[.45]'}"
						aria-label={item.name}
						aria-pressed={i === active}
						onclick={() => (active = i)}
					>
						{#if item.image}
							<img src={getImageCDNUrl(item.image, 240, 0)} alt="" class="h-full w-full object-contain" loading="lazy" decoding="async" />
						{/if}
					</button>
				{/each}
			</div>
		</div>
	</div>
{/if}
