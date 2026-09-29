<script lang="ts">
	// design/components/ProductCard: a 4:5 image well on `surface` above one line of meta, the name
	// in uppercase `label` on the left and the price in `ink-muted` on the right. The whole card is
	// one link, and it carries at most one badge. No cart buttons, ratings or swatches: the product
	// page does that work.
	//
	// Used by every listing (Shop all, Category and Collection pages, search), the homepage's featured
	// products and the product page's related products, so it only needs a product as any of those
	// load it: `title` or `name`, `slug`, `price` (or `variants[].price`), `thumbnail`, and
	// optionally `badge` and `soldOut` (vendure-corrections.ts adds both to search results).
	import { page } from '$app/state'
	import { formatPrice } from '$lib/core/utils'
	import { getImageCDNUrl } from '@misiki/kitcommerce-core/utils'
	import { toCssRatio } from '$lib/theme/aspect-ratio.js'
	import Badge from './Badge.svelte'
	import { productBadge } from './product-badge.js'

	let { product, aspectRatio, priority = false }: { product: any; aspectRatio?: string; priority?: boolean; [key: string]: unknown } = $props()

	const uid = $props.id()
	const currencyCode = $derived(page?.data?.store?.currency?.code)
	const mediaRatio = $derived(toCssRatio(aspectRatio || page?.data?.store?.productImageAspectRatio, '4:5'))
	const name = $derived(product?.title || product?.name || '')
	const href = $derived(`/products/${product?.slug}`)
	const image = $derived(product?.thumbnail || product?.image_url || product?.featuredImage || '')

	// `price` is the cheapest variant; when variants cost different amounts, say so rather than
	// advertising the low figure as the price.
	const variantPrices = $derived(
		(Array.isArray(product?.variants) ? product.variants : [])
			.map((variant: any) => Number(variant?.price))
			.filter((value: number) => Number.isFinite(value) && value > 0)
	)
	const minPrice = $derived(variantPrices.length ? Math.min(...variantPrices) : Number(product?.price))
	const hasRange = $derived(variantPrices.length > 1 && Math.max(...variantPrices) > minPrice)
	const price = $derived(Number.isFinite(minPrice) && minPrice > 0 ? `${hasRange ? 'From ' : ''}${formatPrice(minPrice, currencyCode)}` : '')

	const badge = $derived(productBadge(product))
	const soldOut = $derived(!!product?.soldOut)

	let failed = $state(false)
</script>

<!-- One link. Its name is the product's name alone, so "Classic logo tee" finds it; the price and
     badge are its description. -->
<a
	{href}
	class="group flex flex-col gap-4 text-foreground"
	aria-labelledby="{uid}-name"
	aria-describedby="{uid}-price{badge ? ` ${uid}-badge` : ''}"
	data-testid="product-card-{product?.id}"
	data-sveltekit-preload-data="hover"
>
	<div class="relative overflow-hidden bg-card" style="aspect-ratio: {mediaRatio};">
		{#if image && !failed}
			<img
				src={getImageCDNUrl(image, 640, 0)}
				alt=""
				loading={priority ? 'eager' : 'lazy'}
				fetchpriority={priority ? 'high' : 'auto'}
				decoding="async"
				class="absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-700 ease-standard group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 {soldOut
					? 'opacity-[.45]'
					: ''}"
				onerror={() => (failed = true)}
			/>
		{:else}
			<!-- No image: the well keeps its 4:5 shape, with the mark faint in the middle. -->
			<div class="absolute inset-0 grid place-items-center" aria-hidden="true">
				<img src="/tempered/mark.png" alt="" class="h-10 w-auto opacity-20" />
			</div>
		{/if}
		{#if badge}
			<Badge id="{uid}-badge" label={badge.label} tone={badge.tone} class="absolute left-3 top-3" />
		{/if}
	</div>
	<div class="flex items-baseline justify-between gap-3">
		<span id="{uid}-name" class="text-label uppercase">{name}</span>
		<span id="{uid}-price" class="whitespace-nowrap text-price tabular-nums text-muted-foreground">{price}</span>
	</div>
</a>
