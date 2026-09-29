// Corrections to @misiki/vendure-connector's money figures and coupon errors, applied by active.ts
// when the Engine is Vendure. The connector is package-owned, so it is wrapped here, not edited.
//
// 1. Discounts vanished. The connector reads the cart's subtotal from Vendure's `subTotalWithTax`,
//    which already has order-level promotions taken off, and derives the discount as
//    `subtotal + shipping - total`, which is therefore always zero. A coupon silently shrank the
//    subtotal and never got a line of its own. The goods' undiscounted value is the sum of the
//    lines' `linePriceWithTax`; the discount is what that and shipping come to above the total.
// 2. Every coupon code "applied". `applyCouponCode` answers a bad code with an ErrorResult, not an
//    exception, and the connector never read it, so the shopper saw nothing happen.
// 3. No coupon could be removed. The connector's `removeCouponCode` mutation spreads
//    `... on ErrorResult`, but that field returns a plain Order, so Vendure rejects the whole
//    document with a 400.
// 4. Orders (confirmation, history, detail) carried no discount, coupon or tax figures at all.
// 5. Order statuses were Vendure's state names ("PaymentSettled"), which the pages printed raw.
//    They are plain words here ("Paid"), in the vocabulary StatusCell colours.
// 6. Listing and search results said nothing about stock (every one reported `stock: 0`) and
//    dropped the product's facets, so a card could show neither "Sold out" nor a New / Limited
//    badge. The search asks for `inStock` and `facetValueIds` too, and each result gets
//    `soldOut` and `badge` (its Badge facet value, e.g. Badge:New in the catalogue).
//
// Tax is `totalWithTax - total`: what the total contains, not something added to it when the
// store's prices include tax (see `currency.includesTax` in kitcommerce.config.ts).

type Minor = number | null | undefined
type Query = (path: string, query: string, variables?: Record<string, unknown>) => Promise<any>
type ServiceClass = { prototype: Record<string, any> }

const APPLY_COUPON = `
  mutation ApplyCouponCode($couponCode: String!) {
    applyCouponCode(couponCode: $couponCode) {
      ... on Order { id }
      ... on ErrorResult { errorCode message }
    }
  }
`

const REMOVE_COUPON = `
  mutation RemoveCouponCode($couponCode: String!) {
    removeCouponCode(couponCode: $couponCode) { id }
  }
`

const ORDER_TOTALS = `
  query OrderTotals($code: String!) {
    orderByCode(code: $code) { couponCodes total totalWithTax }
  }
`

/** Vendure order states as a shopper reads them: where the order is. */
const ORDER_STATUS: Record<string, string> = {
	Created: 'Pending',
	Draft: 'Pending',
	AddingItems: 'Pending',
	ArrangingPayment: 'Pending',
	ArrangingAdditionalPayment: 'Awaiting payment',
	PaymentAuthorized: 'Authorized',
	PaymentSettled: 'Paid',
	PartiallyShipped: 'Partially shipped',
	Shipped: 'Shipped',
	PartiallyDelivered: 'Partially delivered',
	Delivered: 'Delivered',
	Modifying: 'Being updated',
	Cancelled: 'Cancelled'
}

/** The same states, answering only "has it been paid?". */
const PAYMENT_STATUS: Record<string, string> = {
	PaymentAuthorized: 'Authorized',
	PaymentSettled: 'Paid',
	PartiallyShipped: 'Paid',
	Shipped: 'Paid',
	PartiallyDelivered: 'Paid',
	Delivered: 'Paid',
	Cancelled: 'Cancelled'
}

/** A state this file doesn't know yet still reads as words: "SomeNewState" → "Some new state". */
const words = (state: string) => state.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^(.)(.*)$/, (_, a, b) => a + b.toLowerCase())

export const orderStatus = (state?: string) => (state ? (ORDER_STATUS[state] ?? words(state)) : state)
export const paymentStatus = (state?: string) => (state ? (PAYMENT_STATUS[state] ?? 'Pending') : state)

const fractionDigits = (currencyCode?: string) => {
	try {
		return new Intl.NumberFormat('en', { style: 'currency', currency: currencyCode || 'USD' }).resolvedOptions().maximumFractionDigits ?? 2
	} catch {
		return 2
	}
}

const fromMinor = (value: Minor, currencyCode?: string) => (Number(value) || 0) / 10 ** fractionDigits(currencyCode)

/** Rounds away float noise from summing major units, e.g. 38 + 10 - 44.2. */
const money = (value: number, currencyCode?: string) => {
	const scale = 10 ** fractionDigits(currencyCode)
	return Math.round(value * scale) / scale
}

type SearchItem = { inStock?: boolean; facetValueIds?: string[] }
type SearchFacetValue = { facetValue?: { id?: string; name?: string; facet?: { code?: string; name?: string } } }

/** What a search result adds to a product card: whether it is sold out, and its Badge facet. */
export function searchExtras(items: SearchItem[], facetValues: SearchFacetValue[]) {
	const badges = new Map<string, string>()
	for (const { facetValue } of facetValues) {
		const facet = (facetValue?.facet?.code ?? facetValue?.facet?.name ?? '').toLowerCase()
		if (facet === 'badge' && facetValue?.id && facetValue.name) badges.set(facetValue.id, facetValue.name)
	}
	return items.map((item) => ({
		soldOut: item?.inStock === false,
		badge: (item?.facetValueIds ?? []).map((id) => badges.get(id)).find(Boolean) ?? null
	}))
}

export function correctVendureConnector(connector: { CartService?: ServiceClass; OrderService?: ServiceClass; SearchService?: ServiceClass }) {
	const search = connector.SearchService?.prototype
	if (search?.mapVendureSearchToProductSearchResult && search.query) {
		// Own property on SearchService, so every other service keeps BaseService's query.
		const query = search.query
		search.query = function (path: string, document: unknown, variables?: Record<string, unknown>) {
			const asked =
				typeof document === 'string' && document.includes('query SearchProducts') && !document.includes('inStock')
					? document.replace('productName', 'productName\n        inStock\n        facetValueIds')
					: document
			return query.call(this, path, asked, variables)
		}
		const mapSearch = search.mapVendureSearchToProductSearchResult
		search.mapVendureSearchToProductSearchResult = function (result: any) {
			const mapped = mapSearch.call(this, result)
			if (!mapped?.data?.length) return mapped
			const extras = searchExtras(result?.search?.items ?? [], result?.search?.facetValues ?? [])
			return { ...mapped, data: mapped.data.map((product: any, i: number) => ({ ...product, ...extras[i] })) }
		}
	}

	const cart = connector.CartService?.prototype
	const orders = connector.OrderService?.prototype
	if (!cart?.mapVendureOrder || !orders?.getOrder) return

	const mapCart = cart.mapVendureOrder
	cart.mapVendureOrder = function (order: any) {
		const mapped = mapCart.call(this, order)
		if (!order?.lines) return mapped
		const currencyCode = order.currencyCode
		const goods = order.lines.reduce((sum: number, line: any) => sum + (Number(line.linePriceWithTax) || 0), 0)
		const shipping = Number(order.shippingWithTax ?? order.shipping) || 0
		const total = Number(order.totalWithTax ?? order.total) || 0
		const discount = fromMinor(Math.max(0, goods + shipping - total), currencyCode)
		return { ...mapped, subtotal: fromMinor(goods, currencyCode), discountAmount: discount, savingAmount: discount }
	}

	cart.applyCoupon = async function ({ couponCode }: { couponCode: string }) {
		const res = await (this.query as Query).call(this, '/shop-api', APPLY_COUPON, { couponCode })
		const result = res?.applyCouponCode
		if (result?.errorCode) throw new Error(result.message || `The code "${couponCode}" can't be used`)
		return this.fetchCartData()
	}

	cart.removeCoupon = async function () {
		const current = await this.fetchCartData()
		if (current?.couponCode) {
			await (this.query as Query).call(this, '/shop-api', REMOVE_COUPON, { couponCode: current.couponCode })
		}
		return this.fetchCartData()
	}

	// An order's lines keep their undiscounted price (`subtotal`), so the discount follows from the
	// charged total. The coupon and the tax need one more small query. The connector reports the raw
	// state as both statuses; each gets its own plain words.
	const corrected = (order: any, extra?: { couponCodes?: string[]; total?: Minor; totalWithTax?: Minor }) => {
		if (!order?.lineItems) return order
		const currencyCode = order.currencyCode
		const goods = money(
			order.lineItems.reduce((sum: number, line: any) => sum + (Number(line.subtotal) || 0), 0),
			currencyCode
		)
		const discount = money(Math.max(0, goods + (Number(order.shippingCharges) || 0) - (Number(order.total) || 0)), currencyCode)
		const tax = extra ? fromMinor(Number(extra.totalWithTax) - Number(extra.total), currencyCode) : order.tax
		return {
			...order,
			subtotal: goods,
			discount,
			couponCode: extra?.couponCodes?.[0] ?? order.couponCode ?? null,
			tax,
			status: orderStatus(order.status),
			paymentStatus: paymentStatus(order.paymentStatus)
		}
	}

	async function totalsFor(service: any, code?: string) {
		if (!code) return undefined
		try {
			return (await (service.query as Query).call(service, '/shop-api', ORDER_TOTALS, { code }))?.orderByCode ?? undefined
		} catch {
			return undefined
		}
	}

	const getOrder = orders.getOrder
	orders.getOrder = async function (orderNo: string) {
		const order = await getOrder.call(this, orderNo)
		return corrected(order, await totalsFor(this, order?.orderNo))
	}

	const listOrdersByParent = orders.listOrdersByParent
	orders.listOrdersByParent = async function (params: any) {
		const res = await listOrdersByParent.call(this, params)
		if (!res?.data?.length) return res
		const data = await Promise.all(res.data.map(async (order: any) => corrected(order, await totalsFor(this, order?.orderNo))))
		return { ...res, data }
	}

	const list = orders.list
	orders.list = async function (params: any) {
		const res = await list.call(this, params)
		return res?.data ? { ...res, data: res.data.map((order: any) => corrected(order)) } : res
	}
}
