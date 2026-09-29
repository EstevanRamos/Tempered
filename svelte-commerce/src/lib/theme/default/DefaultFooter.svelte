<script lang="ts">
	// Tempered's footer (the 2026-09 redesign): Join the list on the left when the store has
	// somewhere to put an address, three link columns on the right, a legal line, and the TEMPERED
	// wordmark drawn as an outlined gold hairline across the full width. It sits on the ground, a
	// `line` hairline above.
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

	const shop = $derived<Link[]>([...catalogue.categories.map((c) => ({ name: c.name, link: c.link })), { name: 'Shop all', link: '/products' }])
	const brand = $derived<Link[]>([
		{ name: 'Our story', link: '/our-story' },
		...catalogue.collections.map((c) => ({ name: `${c.name} collection`, link: c.link }))
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

	// Join the list: only where an address has somewhere to go (newsletter-subscribe.ts).
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
	<div class="page-width grid grid-cols-1 gap-10 pt-10 text-small md:pt-12 lg:grid-cols-12 lg:gap-x-5">
		{#if targets.available}
			<div class="flex flex-col gap-3 lg:col-span-5">
				{#if subscribed}
					<p class="text-foreground">Join the list</p>
					<p role="status" class="text-muted-foreground">You’re on the list.</p>
				{:else}
					<form class="flex max-w-[380px] flex-col gap-3" onsubmit={join} novalidate>
						<label for="footer-email" class="text-foreground">Join the list</label>
						<div class="flex h-12 items-center border-b border-border-strong focus-within:border-foreground">
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

		<div class="grid grid-cols-3 gap-4 lg:col-span-6 lg:col-start-7 lg:gap-5">
			{#each columns as column (column.title)}
				<div class="flex flex-col gap-2.5">
					<h2 class="font-sans text-small font-normal text-faint-foreground">{column.title}</h2>
					<ul class="flex flex-col">
						{#each column.links as item (item.link)}
							<li>
								<a href={item.link} class="inline-flex min-h-8 items-center text-foreground transition-colors hover:text-primary">{item.name}</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>

	<div class="page-width flex justify-between gap-4 pt-12 text-[12px] leading-4 text-faint-foreground md:pt-16">
		<p>© {year} {name}</p>
		<p>Play with purpose.</p>
	</div>

	<!-- The wordmark as an outlined gold hairline, stretched to the full width. Decoration: the
	     store's name is already in the legal line. -->
	<div class="pb-4 pt-7 md:pb-6 md:pt-12" aria-hidden="true">
		<svg viewBox="0 0 1000 112" class="wordmark block h-auto w-full overflow-visible opacity-40">
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
		stroke: hsl(var(--primary-hover));
		/* The SVG scales with the page, so the stroke thickens on a phone to stay a visible hairline. */
		stroke-width: 2.4;
	}

	@media (min-width: 768px) {
		.wordmark text {
			stroke-width: 0.9;
		}
	}
</style>
