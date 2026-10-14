/**
 * Rich text from the Engine (a Category's or Collection's description) as one plain line for a
 * meta description: tags out, the common entities decoded, whitespace collapsed. The core's
 * `parseHTMLToText` returns its input unchanged, so it can't be used for this.
 */
const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–', hellip: '…' }

export function metaText(html: string | null | undefined): string {
	return String(html ?? '')
		.replace(/<[^>]*>/g, ' ')
		.replace(/&(#\d+|#x[\da-f]+|[a-z]+);/gi, (entity, code: string) => {
			if (code[0] === '#') return String.fromCodePoint(code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10))
			return ENTITIES[code.toLowerCase()] ?? entity
		})
		.replace(/\s+/g, ' ')
		.trim()
}
