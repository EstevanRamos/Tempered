import { describe, it, expect, vi, beforeEach } from 'vitest'

// The store's own list and Klaviyo are the two places an address can land. Which of them exists is
// configuration, so both are stubbed: these tests are about the store's newsletter switch.
const capability = vi.hoisted(() => ({ storeList: false }))
vi.mock('$lib/core/services', () => ({ storeService: { post: vi.fn() } }))
vi.mock('$lib/components/common/store-capabilities.js', () => ({ canSubscribeToNewsletter: () => capability.storeList }))
vi.mock('$lib/klaviyo', () => ({
	resolveKlaviyoConfig: (plugins: any) => ({ active: !!plugins?.klaviyo?.active }),
	klaviyoIdentify: vi.fn(),
	klaviyoSubscribe: vi.fn()
}))

const { newsletterTargets } = await import('$lib/components/common/newsletter-subscribe')

const klaviyo = { active: true, publicKey: 'ABC123', listId: 'L1' }

describe('newsletterTargets', () => {
	beforeEach(() => {
		capability.storeList = false
	})

	it('offers a signup when the newsletter is on and Klaviyo is configured', () => {
		expect(newsletterTargets({ newsletter: { active: true }, klaviyo }).available).toBe(true)
	})

	it('offers a signup when the newsletter is on and the store keeps its own list', () => {
		capability.storeList = true
		expect(newsletterTargets({ newsletter: { active: true } }).available).toBe(true)
	})

	it('offers none when the store has switched the newsletter off, even with Klaviyo configured', () => {
		capability.storeList = true
		expect(newsletterTargets({ newsletter: { active: false }, klaviyo }).available).toBe(false)
	})

	it('offers none when the store does not say the newsletter is on', () => {
		expect(newsletterTargets({ klaviyo }).available).toBe(false)
		expect(newsletterTargets(undefined).available).toBe(false)
	})

	it('offers none when the newsletter is on but an address has nowhere to go', () => {
		expect(newsletterTargets({ newsletter: { active: true } }).available).toBe(false)
	})
})
