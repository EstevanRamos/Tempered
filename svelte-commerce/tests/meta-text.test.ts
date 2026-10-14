import { describe, it, expect } from 'vitest'
import { metaText } from '$lib/components/seo/meta-text'

// Engine descriptions are rich text; a meta description is one plain line.
describe('metaText', () => {
	it('strips tags and joins blocks with a space', () => {
		expect(metaText('<p>Poker is war.</p><p>A <strong>limited</strong> drop.</p>')).toBe('Poker is war. A limited drop.')
	})

	it('decodes the common entities', () => {
		expect(metaText('Tees &amp; joggers&nbsp;&mdash; made &quot;right&quot; &#39;til the end')).toBe('Tees & joggers — made "right" \'til the end')
	})

	it('collapses whitespace and line breaks', () => {
		expect(metaText('  Heavyweight,<br/>\n  cut   boxy. ')).toBe('Heavyweight, cut boxy.')
	})

	it('is empty for nothing', () => {
		expect(metaText(undefined)).toBe('')
		expect(metaText('<p></p>')).toBe('')
	})
})
