<script lang="ts">
	import { page } from '$app/state'
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'
	import { useProductState } from '$lib/core/composables/index.js'
	import { Skeleton } from '$lib/components/ui/skeleton/index.js'
	import { toCssRatio } from '$lib/theme/aspect-ratio.js'
	import { SearchService } from '$lib/core/services/index.js'

	const productState = useProductState()

	// Same ratio the cards below resolve to, so the skeleton reserves the height the products will
	// actually occupy. This grid used to force `aspectRatio="square"` on the card while the
	// homepage grid honoured the store's 2:3 setting — one catalogue, two card shapes.
	const mediaRatio = $derived(toCssRatio(page?.data?.store?.productImageAspectRatio, '1:1'))

	// The core loads related products by the product's category hierarchy, which a backend like
	// Vendure never sends, so the section never appeared. There, fall back to the rest of the shop
	// from search (whose results also carry badge and sold-out), four at most.
	const needsFallback = $derived(!page.data?.product?.categoryHierarchy?.length)
	let fallback = $state<any[]>([])
	let loadingFallback = $state(false)

	$effect(() => {
		const productId = page.data?.product?.id
		if (!needsFallback || !productId) return
		let cancelled = false
		loadingFallback = true
		new SearchService(fetch)
			.searchWithQuery('')
			.then((result: { data?: any[] }) => {
				if (!cancelled) fallback = (result?.data ?? []).filter((p) => String(p.id) !== String(productId)).slice(0, 4)
			})
			.catch(() => {
				if (!cancelled) fallback = []
			})
			.finally(() => {
				if (!cancelled) loadingFallback = false
			})
		return () => {
			cancelled = true
		}
	})

	const related = $derived(needsFallback ? fallback : productState.productsOfSameCategory)
	const loading = $derived(needsFallback ? loadingFallback : productState.isLoadingRelatedProducts)
</script>

{#if loading || related.length > 0}
	<div class="edp-related mb-12" data-testid="related-products">
		<header class="edp-related-head">
			<span class="edp-related-eyebrow">More to explore</span>
			<h2 class="edp-related-title text-center text-lg font-semibold sm:text-xl">Related Products</h2>
			<span class="edp-related-rule" aria-hidden="true"></span>
		</header>

		{#if loading}
			<!-- Skeleton cards in the real grid, not a centred spinner: the rail keeps its height,
			     so nothing below it jumps when the products arrive. The spinner this replaces was
			     also invisible — `border-primary-500` is not a class this project defines, so it
			     rendered as a transparent ring. -->
			<div class="edp-related-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" aria-hidden="true">
				{#each { length: 6 } as _}
					<div class="flex flex-col gap-2">
						<Skeleton class="w-full" style="aspect-ratio: {mediaRatio};" />
						<Skeleton class="h-4 w-3/4" />
						<Skeleton class="h-4 w-1/3" />
					</div>
				{/each}
			</div>
		{:else}
			<div class="edp-related-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
				{#each related as { id, slug, thumbnail, price, mrp, title, vendor, variants, badge, soldOut } (id)}
					<ProductCard
						product={{
							id,
							slug,
							thumbnail,
							price,
							mrp,
							title,
							vendor,
							variants,
							badge,
							soldOut
						}}
					/>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	/* One gap declaration for the rail; the default theme narrows it below. */
	.edp-related-grid {
		gap: 12px;
	}

	/* Refined Editorial — default theme only. Card itself is already editorial;
	   this restyles the section heading and gutters only. */
	/* Was margin-top clamp(48px, 8vw, 96px) + padding-top clamp(32px, 5vw, 56px) — up to 152px
	   of empty page between the buy box and this heading, on top of the parent column gap. */
	:global([data-theme='default'] .edp-related) {
		margin-top: clamp(64px, 6.7vw, 96px);
		padding-top: clamp(64px, 6.7vw, 96px);
		border-top: 1px solid var(--ed-line);
	}

	:global([data-theme='default'] .edp-related-head) {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		margin-bottom: clamp(16px, 2.5vw, 24px);
	}

	:global([data-theme='default'] .edp-related-eyebrow) {
		font-family: var(--ed-body);
		/* 12px floor for supporting text; 11.2px all-caps at 0.2em tracking sits under it. */
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.32em;
		text-transform: uppercase;
		color: var(--ed-soft);
	}

	/* Was clamp(1.8rem, 3.4vw, 2.8rem) — a 44.8px section heading at 1440, well past the 32px
	   ceiling and larger than the product's own h1. The clamp below is the storefront's section-
	   title step, identical to .ed-head__title / .ed-banner__title / .ed-news__title on the
	   homepage: 22px on a phone, 28px on a desktop. "Related Products" and "Featured pieces" are
	   the same thing — a serif heading introducing a grid of product cards — so they get the same
	   size instead of 20/25.6 here and 22/28 there. */
	/* Tempered's SectionHeader: the display serif, uppercase and tracked, over a short gold rule. */
	:global([data-theme='default'] .edp-related-title) {
		margin: 12px 0 0;
		font-family: var(--ed-display);
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		font-size: clamp(1.75rem, 2.6vw, 2.25rem);
		line-height: 1.17;
		color: var(--ed-ink);
	}

	.edp-related-rule {
		display: none;
	}

	:global([data-theme='default'] .edp-related-rule) {
		display: block;
		width: 32px;
		height: 1px;
		margin-top: 16px;
		background: hsl(var(--primary));
	}

	/* The shared product-grid rhythm — see .ed-products (homepage) and .ed-grid (listing). */
	:global([data-theme='default'] .edp-related-grid) {
		gap: 40px 16px;
	}

	@media (min-width: 768px) {
		:global([data-theme='default'] .edp-related-grid) {
			gap: 48px 24px;
		}
	}

	/* Four across on desktop, like every Tempered product grid. */
	@media (min-width: 1280px) {
		:global([data-theme='default'] .edp-related-grid) {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
</style>
