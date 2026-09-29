<script lang="ts">
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button'

	// Sign-up logs the shopper straight in: the Engine sends no verification email, so this page
	// must not ask for one. Earlier orders placed as a guest with the same email are already on
	// the account.
	const email = $derived(page.url.searchParams.get('email'))
	const storeName = $derived(page?.data?.store?.name || '')
</script>

<svelte:head>
	<title>Account created - {storeName}</title>
	<meta name="description" content="Your account is ready and you're signed in." />
</svelte:head>

<div class="flex min-h-[60vh] items-center justify-center p-4">
	<div class="w-full max-w-md space-y-6 rounded-radius border border-border bg-background p-8 text-center">
		<div class="space-y-3">
			<h1 class="text-2xl font-semibold text-foreground">Welcome to {storeName}</h1>
			<p class="text-sm text-muted-foreground">
				Your account is ready and you're signed in{#if email}&nbsp;as <span class="font-medium text-foreground">{email}</span>{/if}. Orders placed
				with this email, including any you placed as a guest, are in your order history.
			</p>
		</div>

		<div class="flex flex-col gap-2">
			<Button href="/my/orders" class="h-11 w-full">View your orders</Button>
			<Button href="/" variant="outline" class="h-11 w-full">Continue shopping</Button>
		</div>
	</div>
</div>
