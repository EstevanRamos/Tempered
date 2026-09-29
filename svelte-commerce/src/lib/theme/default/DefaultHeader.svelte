<script lang="ts">
	// Tempered's header (design/components/Header): nav on the left, the gold crest in the centre,
	// Search / Account / Cart as words on the right. On the homepage it floats over the hero,
	// transparent on a soft scrim, and turns solid once the page scrolls; everywhere else it is solid
	// with a `line` hairline beneath. On phones the nav folds behind a two-hairline menu button that
	// opens a full-screen menu set in the display serif.
	import { page } from '$app/state'
	import { fade } from 'svelte/transition'
	import type { NavModule } from '$lib/core/composables/index.js'
	import MsSearch from '$lib/components/nav/ms-search.svelte'
	import CartSidebar from '$lib/components/nav/cart-sidebar.svelte'
	import ProfileDropdown from '$lib/components/nav/profile-dropdown.svelte'
	import AuthButton from '$lib/components/auth/auth-button.svelte'
	import { dialog } from '$lib/actions/dialog.js'
	import Crest from './Crest.svelte'
	import { headerWord } from './header-word.js'

	interface Props {
		navModule: NavModule
		/** Theme-content announcement line, already resolved by the caller. */
		announcement?: string
		announcementHref?: string
		/** The hello-bar plugin's content (merchant HTML), which takes the slot when it has any. */
		announcementHtml?: string
	}

	let { navModule, announcement = '', announcementHref = '', announcementHtml = '' }: Props = $props()

	const store = $derived(page.data?.store)
	const name = $derived(store?.name || 'Tempered')
	const userState = $derived(navModule.userState)
	const signedIn = $derived(!!userState?.user?.role)
	// The store's header menu (the Engine's Shop Categories plus Shop all, see catalogue-tree.ts),
	// then the story.
	const links = $derived<{ id?: string; link: string; name: string }[]>([
		...(store?.menu?.find((menu: { menuId?: string }) => menu?.menuId === 'header')?.items ?? []),
		{ link: '/our-story', name: 'Our story' }
	])
	const isCheckout = $derived(page.url.pathname.startsWith('/checkout'))
	const isHome = $derived(page.route?.id === '/(www)')
	const isCurrent = (href: string) => page.url.pathname === href

	let scrollY = $state(0)
	// Over the hero until the page moves; solid after, so the words never sit on product imagery.
	const overlay = $derived(isHome && scrollY < 8)

	let menuOpen = $state(false)
	const closeMenu = () => (menuOpen = false)

	// The page behind the open menu must not scroll under a touch drag.
	$effect(() => {
		if (!menuOpen) return
		const previous = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.overflow = previous
		}
	})

	// A navigation closes the menu (a link inside it, or the browser's back button).
	$effect(() => {
		page.url.pathname
		menuOpen = false
	})
</script>

<svelte:window bind:scrollY />

{#if announcement || announcementHtml}
	<!-- The announcement bar, for promos: a quiet line on the ground, not gold (the cart count is the
	     header's one gold element). -->
	<div class="bg-background text-center">
		<p class="page-width py-2.5 text-[12px] leading-4 text-faint-foreground">
			{#if announcementHtml}
				{@html announcementHtml}
			{:else if announcementHref}
				<a href={announcementHref} class="inline-flex min-h-6 items-center transition-colors hover:text-foreground">{announcement}</a>
			{:else}
				{announcement}
			{/if}
		</p>
	</div>
{/if}

<header
	class="sticky top-0 z-sticky w-full border-b transition-colors duration-panel {isHome ? '-mb-[76px] md:-mb-24' : ''} {overlay
		? 'header--overlay border-transparent'
		: 'border-border bg-background'}"
>
	<div class="page-width grid grid-cols-[1fr_auto_1fr] items-center gap-4 {isHome ? 'h-[76px] md:h-24' : 'h-14 md:h-[72px]'}">
		<div class="flex items-center">
			<button
				type="button"
				class="-ml-3 flex size-11 flex-col justify-center gap-1.5 px-3 lg:hidden"
				aria-label="Menu"
				aria-expanded={menuOpen}
				aria-controls="tempered-menu"
				onclick={() => (menuOpen = true)}
			>
				<span class="block h-px w-5 bg-foreground"></span>
				<span class="block h-px w-3.5 bg-foreground"></span>
			</button>
			<nav aria-label="Main navigation" class="hidden items-center gap-8 lg:flex">
				{#each links as item (item.link)}
					<a
						href={item.link}
						class={headerWord}
						class:text-foreground={isCurrent(item.link)}
						aria-current={isCurrent(item.link) ? 'page' : undefined}
					>
						{item.name}
					</a>
				{/each}
			</nav>
		</div>

		<a href="/" class="flex items-center" aria-label="{name}, home">
			{#if store?.logo}
				<img src={store.logo} alt="" class="h-7 w-auto md:h-[34px]" />
			{:else}
				<Crest class={isHome ? 'h-11 md:h-[58px]' : 'h-9 md:h-11'} />
			{/if}
		</a>

		<div class="flex items-center justify-end gap-4 md:gap-8">
			<MsSearch words />
			<div class="hidden sm:block">
				{#if signedIn}
					<ProfileDropdown words onSignOut={navModule.handleSignOut} />
				{:else}
					<AuthButton aria-label="Account, sign in" type="login" class="{headerWord} cursor-pointer">Account</AuthButton>
				{/if}
			</div>
			{#if !isCheckout}
				<CartSidebar
					words
					onClose={navModule.closeCartSidebar}
					onContinueShopping={navModule.handleContinueShoppingClick}
					onRemoveCartItem={navModule.removeCartItem}
				/>
			{/if}
		</div>
	</div>
</header>

{#if menuOpen}
	<!-- A full-screen modal menu: `use:dialog` moves focus in, traps Tab, closes on Escape and returns
	     focus to the menu button. -->
	<div
		id="tempered-menu"
		class="fixed inset-0 z-drawer flex flex-col overflow-y-auto bg-background px-6 text-foreground"
		role="dialog"
		aria-modal="true"
		aria-label="Menu"
		tabindex="-1"
		use:dialog={closeMenu}
		transition:fade={{ duration: 200 }}
	>
		<div class="flex h-[76px] shrink-0 items-center justify-between">
			<a href="/" aria-label="{name}, home" onclick={closeMenu}><Crest class="h-8" /></a>
			<button type="button" class="{headerWord} -mr-2 px-2 text-foreground" onclick={closeMenu}>Close</button>
		</div>
		<nav aria-label="Main navigation">
			<ul class="flex flex-col">
				{#each links as item (item.link)}
					<li class="border-b border-border">
						<a
							href={item.link}
							class="flex min-h-[76px] items-center font-serif text-[34px] uppercase leading-none tracking-[0.1em] transition-colors hover:text-primary"
							aria-current={isCurrent(item.link) ? 'page' : undefined}
							onclick={closeMenu}
						>
							{item.name}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
		<div class="flex flex-wrap gap-x-6 pb-10 pt-8">
			{#if signedIn}
				<a href="/my/orders" class={headerWord} onclick={closeMenu}>Orders</a>
				<a href="/my/profile" class={headerWord} onclick={closeMenu}>Account</a>
				<button
					type="button"
					class={headerWord}
					onclick={() => {
						closeMenu()
						navModule.handleSignOut()
					}}
				>
					Sign out
				</button>
			{:else}
				<!-- Closed from the wrapper: AuthButton's own click opens the sign-in modal. -->
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<div onclick={closeMenu}>
					<AuthButton type="login" aria-label="Account, sign in" class="{headerWord} cursor-pointer">Account</AuthButton>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	/* Over the hero: a scrim from the ground at 60% to nothing, so the words hold their contrast on
	   the photograph's dark top edge. */
	.header--overlay {
		background: linear-gradient(180deg, hsl(var(--background) / 0.6), hsl(var(--background) / 0));
	}
</style>
