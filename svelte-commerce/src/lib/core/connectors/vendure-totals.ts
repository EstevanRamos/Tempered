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

export function correctVendureTotals(connector: { CartService?: ServiceClass; OrderService?: ServiceClass }) {
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
	// charged total. The coupon and the tax need one more small query.
	const withTotals = (order: any, extra?: { couponCodes?: string[]; total?: Minor; totalWithTax?: Minor }) => {
		if (!order?.lineItems) return order
		const currencyCode = order.currencyCode
		const goods = money(
			order.lineItems.reduce((sum: number, line: any) => sum + (Number(line.subtotal) || 0), 0),
			currencyCode
		)
		const discount = money(Math.max(0, goods + (Number(order.shippingCharges) || 0) - (Number(order.total) || 0)), currencyCode)
		const tax = extra ? fromMinor(Number(extra.totalWithTax) - Number(extra.total), currencyCode) : order.tax
		return { ...order, subtotal: goods, discount, couponCode: extra?.couponCodes?.[0] ?? order.couponCode ?? null, tax }
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
		return withTotals(order, await totalsFor(this, order?.orderNo))
	}

	const listOrdersByParent = orders.listOrdersByParent
	orders.listOrdersByParent = async function (params: any) {
		const res = await listOrdersByParent.call(this, params)
		if (!res?.data?.length) return res
		const data = await Promise.all(res.data.map(async (order: any) => withTotals(order, await totalsFor(this, order?.orderNo))))
		return { ...res, data }
	}

	const list = orders.list
	orders.list = async function (params: any) {
		const res = await list.call(this, params)
		return res?.data ? { ...res, data: res.data.map((order: any) => withTotals(order)) } : res
	}
}
