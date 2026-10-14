import { storeService } from '$lib/core/services'
import { klaviyoIdentify, klaviyoSubscribe, resolveKlaviyoConfig } from '$lib/klaviyo'
import { canSubscribeToNewsletter } from './store-capabilities.js'

/**
 * Where a newsletter address can land, for this store: the storefront's own list (Litekart's REST
 * API) and Klaviyo. A signup is offered only when the store has switched its newsletter on and at
 * least one of them exists; with neither, a form could only ever fail, so callers render none.
 */
export function newsletterTargets(plugins: unknown) {
	const switchedOn = !!(plugins as { newsletter?: { active?: boolean } } | undefined)?.newsletter?.active
	const storeList = canSubscribeToNewsletter()
	const klaviyo = resolveKlaviyoConfig(plugins as any)
	return { storeList, klaviyo, available: switchedOn && (storeList || klaviyo.active) }
}

/** Subscribes `email` everywhere this store can take it. Throws when the store's own list fails. */
export async function subscribeToNewsletter(email: string, targets: ReturnType<typeof newsletterTargets>, customerId?: string | null) {
	if (targets.storeList) {
		await storeService.post('/api/newsletter/subscribe', { email, customerId: customerId || null })
	}
	// Klaviyo: attach the session to a profile, then subscribe it to the configured list so
	// flows/campaigns can email them. No-op when Klaviyo isn't configured.
	klaviyoIdentify({ email })
	klaviyoSubscribe(email, targets.klaviyo)
}
