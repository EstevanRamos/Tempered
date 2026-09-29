<script lang="ts">
	import { page } from '$app/state'
	import { LockKeyhole } from '@lucide/svelte'
	import { keepResolvableLinks } from '$lib/components/common/cms-pages.js'

	let { children } = $props()

	// The reduced chrome checkout gets instead of the storefront's nav and footer: the brand mark
	// home, a reassurance, and a single row of legal links and payment marks. Nothing that invites
	// the shopper back out of the flow mid-purchase.
	const storeName = $derived(page.data?.store?.name ?? '')
	const legalLinks = $derived(
		keepResolvableLinks(
			[
				{ name: 'Terms', link: '/terms-and-conditions' },
				{ name: 'Privacy', link: '/privacy-policy' },
				{ name: 'Refunds', link: '/refund-policy' },
				{ name: 'Contact', link: '/contact-us' }
			],
			page.data?.cmsPages ?? []
		)
	)
</script>

<!-- Checkout URLs are per-session and must never be indexed. robots.txt only stops crawling,
     not indexing, so state it on the page for the whole checkout tree. -->
<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="ed-checkout flex min-h-screen flex-col">
	<!-- The minimal checkout header: the crowned mark over the tracked wordmark, and one reassurance
	     in words. Nothing that invites the shopper back out of the flow. -->
	<header class="border-b border-border bg-background">
		<div class="page-width grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-4 md:h-[72px]">
			<span></span>
			<a href="/" class="flex flex-col items-center gap-0.5 text-foreground" aria-label="{storeName}, home">
				<img src={page.data?.store?.logo || '/tempered/mark.png'} alt="" class="h-7 w-auto md:h-[34px]" width="24" height="34" />
				<span class="-mr-[0.36em] hidden font-serif text-[13px] font-medium uppercase leading-[14px] tracking-[0.36em] sm:block" aria-hidden="true">
					{storeName}
				</span>
			</a>
			<p class="inline-flex items-center justify-end gap-2 text-eyebrow uppercase tracking-[0.2em] text-muted-foreground">
				<LockKeyhole class="size-3.5" strokeWidth={1} aria-hidden="true" />
				<span class="max-sm:sr-only">Secure checkout</span>
			</p>
		</div>
	</header>

	<main id="main" class="flex-1 pb-16">
		{@render children?.()}
	</main>

	<footer class="border-t border-border bg-background">
		<div class="page-width flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4">
			<p class="text-small text-faint-foreground">© {new Date().getFullYear()} {storeName}</p>
			{#if legalLinks.length}
				<nav aria-label="Checkout legal links" class="flex flex-wrap items-center gap-x-4">
					{#each legalLinks as item}
						<a href={item.link} class="inline-flex min-h-[32px] items-center text-xs text-muted-foreground transition-colors hover:text-foreground">
							{item.name}
						</a>
					{/each}
				</nav>
			{/if}
		</div>
	</footer>
</div>
