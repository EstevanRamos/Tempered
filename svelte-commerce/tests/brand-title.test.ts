import { describe, it, expect } from 'vitest'
import { brandTitle } from '$lib/components/seo/brand-title'

// Every Storefront page title reads "Name | Store"; the homepage may be the store's name alone.
describe('brandTitle', () => {
	it('adds the store name after a bar', () => {
		expect(brandTitle('Tees', 'Tempered')).toBe('Tees | Tempered')
	})

	it('leaves a title that already ends with the store name alone', () => {
		expect(brandTitle('Classic logo tee | Tempered', 'Tempered')).toBe('Classic logo tee | Tempered')
	})

	it('is the store name alone when the title is empty or is the store name', () => {
		expect(brandTitle('', 'Tempered')).toBe('Tempered')
		expect(brandTitle(undefined, 'Tempered')).toBe('Tempered')
		expect(brandTitle('Tempered', 'Tempered')).toBe('Tempered')
	})

	it('replaces a dash suffix or another brand with the bar and the store name', () => {
		expect(brandTitle('Cart - Tempered', 'Tempered')).toBe('Cart | Tempered')
		expect(brandTitle('My Orders | Svelte Commerce', 'Tempered')).toBe('My Orders | Tempered')
	})

	it('keeps a title as it is when there is no store name', () => {
		expect(brandTitle('Tees', '')).toBe('Tees')
		expect(brandTitle('Tees', undefined)).toBe('Tees')
	})

	it('trims stray whitespace and wrapping quotes from CMS titles', () => {
		expect(brandTitle('  "Tees"  ', 'Tempered')).toBe('Tees | Tempered')
	})
})
