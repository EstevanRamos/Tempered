/**
 * Scroll reveal: the element fades up into place the first time it scrolls into view.
 *
 *   <section use:reveal>…</section>
 *
 * Progressive: the server HTML is fully visible, and the element is only hidden once this runs on
 * the client. Anything already on screen at that point (above the fold, or a restored scroll
 * position) is left alone, so nothing a shopper can already see blinks out and back. Reduced
 * motion skips it entirely.
 *
 * One observer is shared by every revealed element, so elements that enter the viewport together
 * arrive in the same callback and are staggered left-to-right, top-to-bottom: a row of cards
 * cascades, a single block on a phone just fades in without waiting on its siblings.
 *
 * The look lives in `src/app.css` under `[data-reveal]`.
 */
const STAGGER_MS = 90
const MAX_STAGGER_MS = 360

let observer: IntersectionObserver | undefined

function sharedObserver() {
	observer ??= new IntersectionObserver(
		(entries) => {
			const arrived = entries
				.filter((entry) => entry.isIntersecting)
				.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
			arrived.forEach((entry, i) => {
				const node = entry.target as HTMLElement
				node.style.setProperty('--reveal-delay', `${Math.min(i * STAGGER_MS, MAX_STAGGER_MS)}ms`)
				node.dataset.reveal = 'in'
				observer?.unobserve(node)
			})
		},
		{ rootMargin: '0px 0px -8% 0px' }
	)
	return observer
}

export function reveal(node: HTMLElement) {
	if (typeof IntersectionObserver === 'undefined') return
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
	if (node.getBoundingClientRect().top < window.innerHeight) return

	node.dataset.reveal = ''
	sharedObserver().observe(node)

	return {
		destroy() {
			observer?.unobserve(node)
		}
	}
}
