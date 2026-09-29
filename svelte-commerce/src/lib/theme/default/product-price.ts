import { formatPrice } from '$lib/core/utils'

/**
 * A product's display price, as any listing loads it: `price` is the cheapest variant, and when
 * variants cost different amounts it says so ("From $34.00") rather than advertising the low figure
 * as the price. Empty when there is no usable price.
 */
export function productPrice(product: any, currencyCode: any): string {
	const variantPrices = (Array.isArray(product?.variants) ? product.variants : [])
		.map((variant: any) => Number(variant?.price))
		.filter((value: number) => Number.isFinite(value) && value > 0)
	const minPrice = variantPrices.length ? Math.min(...variantPrices) : Number(product?.price)
	const hasRange = variantPrices.length > 1 && Math.max(...variantPrices) > minPrice
	return Number.isFinite(minPrice) && minPrice > 0 ? `${hasRange ? 'From ' : ''}${formatPrice(minPrice, currencyCode)}` : ''
}
