import { expect, test, type Page } from '@playwright/test'

// Everything a shopper sees and does, end to end, against the real Storefront + Vendure stack.
// Selects by accessible role and name only: no internal functions, stores or test IDs.

// A Tempered product whose XXL costs more than the other sizes, so choosing it changes the price.
const PRODUCT = { name: 'Classic logo tee', slug: 'classic-logo-tee', option: 'XXL' }

// A fresh shopper each run, so the guest order is theirs alone.
const SHOPPER = {
	'First Name': 'Ace',
	'Last Name': 'Shopper',
	Email: `ace.${Date.now()}@example.com`,
	Phone: '+15555550100',
	'Address Line 1': '1 Card Table Way',
	City: 'Austin',
	State: 'TX',
	'ZIP Code': '78701'
}

/** Opens a page and waits until it has hydrated, so its buttons respond to clicks. */
async function visit(page: Page, path: string) {
	await page.goto(path)
	await hydrated(page)
}

async function hydrated(page: Page) {
	await page.locator('html[data-hydrated]').waitFor({ state: 'attached', timeout: 90_000 })
}

// The worked example: the XXL tee is $38.00, TEMPERED10 takes 10% off the goods (-$3.80) and
// express shipping adds $10.00, so the shopper pays $44.20. Prices include tax.
const CODE = 'TEMPERED10'
const EXPECTED = { subtotal: '$38.00', discount: '$3.80', afterDiscount: '$34.20', shipping: '$10.00', total: '$44.20' }

/** The value beside a price-summary label, e.g. summaryRow(page, 'Subtotal') → the "$38.00" cell. */
function summaryRow(page: Page, label: string | RegExp) {
	return page
		.getByRole('term')
		.filter({ hasText: typeof label === 'string' ? new RegExp(`^\\s*${escape(label)}`) : label })
		.first()
		.locator('xpath=following-sibling::*[1]')
}

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** The first price shown in a block of text, e.g. "$1,558.80". */
const firstPrice = (text: string) => text.match(/\$[\d,]+\.\d{2}/)?.[0]

test('a shopper browses, buys as a guest and sees their order confirmed', async ({ page }) => {
	const bagButton = page.getByRole('button', { name: /^Cart, \d+ items?$/ })
	let lineName = ''

	await test.step('homepage', async () => {
		await visit(page, '/')
		await expect(bagButton).toBeVisible()
	})

	await test.step('the header lists the Categories; a Category page shows only its products', async () => {
		const header = page.getByRole('banner')
		await expect(header.getByRole('link', { name: 'Tees', exact: true })).toBeVisible()
		await expect(header.getByRole('link', { name: 'Joggers', exact: true })).toBeVisible()
		await header.getByRole('link', { name: 'Tees', exact: true }).click()
		await expect(page).toHaveURL(/\/tees$/)
		const main = page.locator('main')
		for (const tee of ['Classic logo tee', 'Elephant arch tee', 'War edition tee']) {
			await expect(main.getByRole('link', { name: tee, exact: true })).toBeVisible()
		}
		await expect(main.getByRole('link', { name: 'Classic joggers', exact: true })).toHaveCount(0)
	})

	await test.step('search finds products by name', async () => {
		await visit(page, '/')
		await page.getByRole('button', { name: 'Open search' }).click()
		const search = page.getByRole('combobox', { name: 'Search products' })
		await search.fill('joggers')
		await search.press('Enter')
		await expect(page).toHaveURL(/search=joggers/)
		const main = page.locator('main')
		await expect(main.getByRole('link', { name: 'Classic joggers', exact: true })).toBeVisible()
		await expect(main.getByRole('link', { name: 'Classic logo tee', exact: true })).toHaveCount(0)
	})

	await test.step('product page: choosing a variant changes the price', async () => {
		await visit(page, `/products/${PRODUCT.slug}`)
		await expect(page.getByRole('heading', { level: 1, name: PRODUCT.name })).toBeVisible()
		const main = page.locator('main')
		const before = firstPrice(await main.innerText())
		expect(before).toBeTruthy()
		const option = page.getByRole('button', { name: PRODUCT.option, exact: true })
		await option.click()
		await expect(option).toHaveAttribute('aria-pressed', 'true')
		await expect.poll(async () => firstPrice(await main.innerText())).not.toBe(before)
	})

	await test.step('add to bag', async () => {
		await page.getByRole('button', { name: 'Add to bag' }).click()
		await expect(bagButton).toHaveAccessibleName('Cart, 1 items')
	})

	await test.step('the bag survives a reload', async () => {
		await visit(page, '/checkout/cart')
		await page.reload()
		await hydrated(page)
		await expect(page.getByRole('heading', { level: 1, name: 'Your bag' })).toBeVisible()
		const line = page.getByRole('heading', { level: 3, name: new RegExp(`^${PRODUCT.name} ${PRODUCT.option}`) })
		await expect(line).toBeVisible()
		lineName = (await line.innerText()).trim()
	})

	await test.step('the price summary says prices include tax, never adds it', async () => {
		await expect(page.getByRole('term').filter({ hasText: /^\s*Tax\s*$/ })).toHaveCount(0)
		await expect(page.getByText(/incl\. tax/)).toBeVisible()
	})

	await test.step('discount code: a wrong code is refused, a right one applies and can be removed', async () => {
		await page.getByRole('button', { name: 'Apply promo code' }).click()
		const codeBox = page.getByRole('textbox', { name: 'Promo code' })
		await codeBox.fill('NOTACODE')
		await page.getByRole('button', { name: 'Apply', exact: true }).click()
		await expect(page.getByText(/NOTACODE.*not valid/i)).toBeVisible()

		await codeBox.fill(CODE)
		await page.getByRole('button', { name: 'Apply', exact: true }).click()
		await expect(summaryRow(page, `Discount (${CODE})`)).toHaveText(new RegExp(`^[−-]\\${EXPECTED.discount}$`))
		await expect(summaryRow(page, 'Subtotal')).toHaveText(EXPECTED.subtotal)
		await expect(summaryRow(page, /Estimated total/)).toHaveText(EXPECTED.afterDiscount)
		// Applying closes the drawer, uncovering the summary.
		await expect(page.getByRole('dialog')).toBeHidden()

		await page.getByRole('button', { name: `Remove code ${CODE}` }).click()
		await expect(page.getByRole('button', { name: `Remove code ${CODE}` })).toBeHidden()
		await expect(summaryRow(page, /Estimated total/)).toHaveText(EXPECTED.subtotal)
		await expect(page.getByRole('term').filter({ hasText: 'Discount' })).toHaveCount(0)

		await page.getByRole('button', { name: 'Apply promo code' }).click()
		await codeBox.fill(CODE)
		await page.getByRole('button', { name: 'Apply', exact: true }).click()
		await expect(summaryRow(page, `Discount (${CODE})`)).toBeVisible()
	})

	await test.step('guest checkout: address', async () => {
		await page.getByRole('button', { name: 'Proceed to Shipping' }).click()
		await expect(page.getByRole('heading', { level: 1, name: 'Delivery address' })).toBeVisible()
		await hydrated(page)
		for (const [field, value] of Object.entries(SHOPPER)) {
			await page.getByRole('textbox', { name: field, exact: true }).fill(value)
		}
		await page.getByRole('button', { name: 'Save & Continue' }).click()
	})

	await test.step('guest checkout: shipping', async () => {
		await expect(page.getByRole('heading', { name: 'Select Shipping Method' })).toBeVisible()
		// A shopper clicks the option's label; the radio's styled dot covers the input itself.
		await page.getByText('Express Shipping', { exact: true }).click()
		await expect(page.getByRole('radio', { name: /^Express Shipping/ })).toBeChecked()
		await page.getByRole('button', { name: 'Review Order' }).click()
	})

	await test.step('guest checkout: review', async () => {
		await expect(page.getByRole('heading', { level: 1, name: 'Review Your Order' })).toBeVisible()
		await expect(page.getByText(lineName, { exact: true })).toBeVisible()
		await expect(page.getByText(SHOPPER['Address Line 1'])).toBeVisible()
		await expect(page.getByText(/^Express Shipping/)).toBeVisible()
		await expect(summaryRow(page, `Discount (${CODE})`)).toHaveText(new RegExp(`^[−-]\\${EXPECTED.discount}$`))
		await expect(summaryRow(page, /^\s*Total/)).toHaveText(EXPECTED.total)
		await page.getByRole('button', { name: 'Confirm Order' }).click()
	})

	await test.step('confirmation shows an order number', async () => {
		await expect(page.getByRole('heading', { level: 1, name: 'Thank you for your order' })).toBeVisible({
			timeout: 60_000
		})
		await expect(page.getByText(/Order #[A-Z0-9]{8,}/)).toBeVisible()
		await expect(page.getByRole('heading', { level: 3, name: lineName })).toBeVisible()
		await expect(summaryRow(page, 'Subtotal')).toHaveText(EXPECTED.subtotal)
		await expect(summaryRow(page, `Discount (${CODE})`)).toHaveText(new RegExp(`^[−-]\\${EXPECTED.discount}$`))
		await expect(summaryRow(page, 'Shipping')).toHaveText(EXPECTED.shipping)
		await expect(summaryRow(page, /^\s*Total/)).toHaveText(EXPECTED.total)
		await expect(page.getByText(/incl\. tax/)).toBeVisible()
	})
})
