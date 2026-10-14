<script lang="ts">
	// Tempered's footer (design/components/Footer): Join the list on the left when the store has
	// switched its newsletter on and has somewhere to put an address, three link columns on the
	// right, a legal line, and the TEMPERED wordmark drawn as an outlined Bodoni hairline across the
	// full width. It sits on the ground, with a `line` hairline above the columns and above the legal
	// line. The wordmark is drawn in `line-strong`, not gold: the footer shares the last screen with
	// whatever gold the page ends on.
	import { page } from '$app/state'
	import { version } from '$app/environment'
	import { z } from 'zod'
	import { keepResolvableLinks } from '$lib/components/common/cms-pages.js'
	import { newsletterTargets, subscribeToNewsletter } from '$lib/components/common/newsletter-subscribe.js'
	import { getUserState } from '$lib/core/stores/index.js'
	import Arrow from './Arrow.svelte'
	import type { CatalogueTree } from './catalogue-tree.js'

	type Link = { name: string; link: string }

	const store = $derived(page.data?.store ?? {})
	const name = $derived(store?.name || 'Tempered')
	const catalogue = $derived<CatalogueTree>(page.data?.catalogue ?? { categories: [], collections: [] })
	const publishedCms = $derived(page.data?.cmsPages ?? [])

	// Shop: the Categories with something in them, then Shop all. Brand: the story, then each Drop.
	const shop = $derived<Link[]>([
		...catalogue.categories.filter((c) => c.count !== 0).map((c) => ({ name: c.name, link: c.link })),
		{ name: 'Shop all', link: '/products' }
	])
	const brand = $derived<Link[]>([
		{ name: 'Our story', link: '/our-story' },
		...catalogue.collections.map((c) => ({ name: `${c.name} drop`, link: c.link }))
	])

	// Help is the store's footer menu, flattened, with the CMS pages this store doesn't publish left
	// out (a dead policy link from every page is worse than none) and the shop links the Shop column
	// already carries dropped.
	const help = $derived.by<Link[]>(() => {
		const footer = store?.menu?.find((menu: { menuId?: string }) => menu?.menuId === 'footer')?.items ?? []
		const flat: Link[] = footer
			.flatMap((column: { items?: Link[] }) => column?.items ?? [])
			.filter((item: Link) => item?.link && item.link !== '/products')
		const seen = new Set<string>()
		return keepResolvableLinks(flat, publishedCms).filter((item: Link) => !seen.has(item.link.toLowerCase()) && seen.add(item.link.toLowerCase()))
	})

	const columns = $derived(
		[
			{ title: 'Shop', links: shop },
			{ title: 'Brand', links: brand },
			{ title: 'Help', links: help }
		].filter((column) => column.links.length)
	)

	// Join the list: only when the newsletter is on and an address has somewhere to go (newsletter-subscribe.ts).
	const userState = getUserState()
	const targets = $derived(newsletterTargets(store?.plugins))
	let email = $state('')
	let error = $state('')
	let sending = $state(false)
	let subscribed = $state(false)

	async function join(event: SubmitEvent) {
		event.preventDefault()
		if (!z.string().email().safeParse(email).success) {
			error = 'Enter a valid email address.'
			return
		}
		error = ''
		sending = true
		try {
			await subscribeToNewsletter(email, targets, userState?.user?.userId)
			subscribed = true
		} catch (e: any) {
			error = e?.message || 'That didn’t go through. Try again.'
		} finally {
			sending = false
		}
	}

	const year = new Date().getFullYear()
</script>

<footer class="overflow-hidden bg-background" aria-label="Site footer" data-build={version}>
	<div class="page-width grid grid-cols-1 gap-12 border-t border-border pt-12 text-small md:pt-16 lg:grid-cols-12 lg:gap-x-6">
		{#if targets.available}
			<div class="flex flex-col gap-3 lg:col-span-5">
				{#if subscribed}
					<p class="text-eyebrow uppercase text-muted-foreground">Join the list</p>
					<p role="status" class="text-muted-foreground">You’re on the list.</p>
				{:else}
					<form class="flex max-w-measure flex-col gap-3" onsubmit={join} novalidate>
						<label for="footer-email" class="text-eyebrow uppercase text-muted-foreground">Join the list</label>
						<!-- The underline turns gold on focus: the focus ring is the one gold that never counts. -->
						<div class="flex h-12 items-center border-b border-border-strong focus-within:border-primary">
							<input
								id="footer-email"
								type="email"
								name="email"
								autocomplete="email"
								placeholder="Email address"
								bind:value={email}
								aria-invalid={error ? 'true' : undefined}
								aria-describedby={error ? 'footer-email-error' : undefined}
								class="h-full min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-faint-foreground"
							/>
							<button
								type="submit"
								class="group flex size-11 items-center justify-end text-foreground disabled:text-faint-foreground"
								disabled={sending}
								aria-label="Join the list"
							>
								<Arrow />
							</button>
						</div>
						{#if error}<p id="footer-email-error" class="text-destructive">{error}</p>{/if}
					</form>
				{/if}
			</div>
		{/if}

		<div class="grid grid-cols-3 gap-4 lg:col-span-6 lg:col-start-7 lg:gap-6">
			{#each columns as column (column.title)}
				<div class="flex flex-col gap-3">
					<h2 class="font-sans text-eyebrow uppercase text-faint-foreground">{column.title}</h2>
					<ul class="flex flex-col">
						{#each column.links as item (item.link)}
							<li>
								<a href={item.link} class="inline-flex min-h-8 items-center text-muted-foreground transition-colors hover:text-foreground">{item.name}</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>

	<div class="page-width mt-12 flex justify-between gap-4 border-t border-border pt-4 text-small text-faint-foreground md:mt-16">
		<p>© {year} {name}</p>
		<p>Play with purpose.</p>
	</div>

	<!-- The wordmark as an outlined Bodoni hairline, stretched to the full width. Decoration: the
	     store's name is already in the legal line. -->
	<div class="pb-4 pt-8 md:pb-6 md:pt-12" aria-hidden="true">
		<svg viewBox="0 0 1000 112" class="wordmark block h-auto w-full overflow-visible">
			<text x="4" y="106" textLength="992" lengthAdjust="spacing">{name.toUpperCase()}</text>
		</svg>
	</div>
</footer>

<style>
	.wordmark text {
		font-family: var(--font-numeral);
		font-variation-settings: 'opsz' 96;
		font-size: 150px;
		fill: none;
		stroke: hsl(var(--border-strong));
		/* The SVG scales with the page, so the stroke thickens on a phone to stay a visible hairline. */
		stroke-width: 2.4;
	}

	@media (min-width: 768px) {
		.wordmark text {
			stroke-width: 0.9;
		}
	}
</style>
