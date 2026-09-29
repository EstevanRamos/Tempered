<script lang="ts">
	// Tempered's header (design/components/Header): nav on the left, the crowned mark over a small
	// tracked TEMPERED wordmark in the centre, Search / Account / Cart as words on the right, a
	// `line` hairline beneath. On phones the nav folds into a "Menu" text button that opens a
	// drawer; the mark stays centred and never below 28px.
	import { page } from '$app/state'
	import { X } from '@lucide/svelte'
	import { fade, fly } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'
	import type { NavModule } from '$lib/core/composables/index.js'
	import MsSearch from '$lib/components/nav/ms-search.svelte'
	import CartSidebar from '$lib/components/nav/cart-sidebar.svelte'
	import ProfileDropdown from '$lib/components/nav/profile-dropdown.svelte'
	import AuthButton from '$lib/components/auth/auth-button.svelte'
	import { dialog } from '$lib/actions/dialog.js'
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
	// The store's header menu: the Engine's Shop Categories plus Shop all (see catalogue-tree.ts).
	const links = $derived<{ id?: string; link: string; name: string }[]>(
		store?.menu?.find((menu: { menuId?: string }) => menu?.menuId === 'header')?.items ?? []
	)
	const isCheckout = $derived(page.url.pathname.startsWith('/checkout'))
	const isCurrent = (href: string) => page.url.pathname === href

	let menuOpen = $state(false)
	const closeMenu = () => (menuOpen = false)

	// The page behind the open drawer must not scroll under a touch drag.
	$effect(() => {
		if (!menuOpen) return
		const previous = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.overflow = previous
		}
	})

	// A navigation closes the drawer (a link inside it, or the browser's back button).
	$effect(() => {
		page.url.pathname
		menuOpen = false
	})
</script>

{#if announcement || announcementHtml}
	<!-- The announcement bar, for promos: a quiet surface band, not gold (the cart count is the
	     header's one gold element). -->
	<div class="border-b border-border bg-card text-center">
		<p class="page-width py-2.5 text-eyebrow uppercase text-muted-foreground">
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

<header class="sticky top-0 z-sticky w-full border-b border-border bg-background">
	<div class="page-width grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-4 md:h-[72px]">
		<div class="flex items-center">
			<button
				type="button"
				class="{headerWord} lg:hidden"
				aria-expanded={menuOpen}
				aria-controls="tempered-menu"
				onclick={() => (menuOpen = true)}
			>
				Menu
			</button>
			<nav aria-label="Main navigation" class="hidden items-center gap-8 lg:flex">
				{#each links as item (item.link)}
					<a href={item.link} class={headerWord} class:text-foreground={isCurrent(item.link)} aria-current={isCurrent(item.link) ? 'page' : undefined}>
						{item.name}
					</a>
				{/each}
			</nav>
		</div>

		<a href="/" class="flex flex-col items-center gap-0.5 text-foreground" aria-label="{name}, home">
			<img src={store?.logo || '/tempered/mark.png'} alt="" class="h-7 w-auto md:h-[34px]" width="24" height="34" />
			<span class="hidden -mr-[0.36em] font-serif text-[13px] font-medium uppercase leading-[14px] tracking-[0.36em] sm:block" aria-hidden="true">
				{name}
			</span>
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
	<!-- A modal drawer: `use:dialog` moves focus in, traps Tab, closes on Escape and returns focus
	     to the Menu button. -->
	<div
		id="tempered-menu"
		class="fixed inset-0 z-drawer flex"
		role="dialog"
		aria-modal="true"
		aria-labelledby="tempered-menu-title"
		tabindex="-1"
		use:dialog={closeMenu}
	>
		<div aria-hidden="true" class="absolute inset-0 bg-background/80" onclick={closeMenu} transition:fade={{ duration: 200 }}></div>
		<div
			class="relative flex h-full w-full max-w-[320px] flex-col border-r border-border bg-popover text-popover-foreground shadow-overlay"
			transition:fly={{ x: -320, duration: 240, easing: cubicOut }}
		>
			<div class="flex h-14 items-center justify-between border-b border-border px-4">
				<h2 id="tempered-menu-title" class="text-eyebrow font-sans uppercase tracking-[0.32em] text-muted-foreground">Menu</h2>
				<button type="button" class="{headerWord} gap-2" onclick={closeMenu}>
					Close <X class="size-4" strokeWidth={1} aria-hidden="true" />
				</button>
			</div>
			<nav aria-label="Main navigation" class="flex-1 overflow-y-auto px-4 py-6">
				<ul class="flex flex-col">
					{#each links as item (item.link)}
						<li class="border-b border-border">
							<a
								href={item.link}
								class="flex min-h-12 items-center text-label uppercase text-foreground transition-colors hover:text-primary"
								aria-current={isCurrent(item.link) ? 'page' : undefined}
								onclick={closeMenu}
							>
								{item.name}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
			<div class="border-t border-border px-4 py-4">
				{#if signedIn}
					<div class="flex flex-col">
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
					</div>
				{:else}
					<!-- Closed from the wrapper: AuthButton's own click opens the sign-in modal. -->
					<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
					<div onclick={closeMenu}>
						<AuthButton type="login" aria-label="Account, sign in" class="{headerWord} cursor-pointer">Account</AuthButton>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
