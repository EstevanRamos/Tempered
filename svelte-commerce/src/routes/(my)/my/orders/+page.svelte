<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import {
		ChevronRight,
		ShoppingBag,
		Calendar,
		Tag,
		Package,
		CreditCard,
		ArrowRight,
		CheckCircle2,
		Clock,
		Truck,
		XCircle,
		AlertCircle,
		LoaderCircle
	} from '@lucide/svelte'
	import { page } from '$app/state'
	import { date, formatPrice } from '$lib/core/utils'
	import { orderService } from '$lib/core/services/index.js'
	import Pagination from '$lib/components/common/pagination.svelte'
	import { fade, fly } from 'svelte/transition'

	// Fetched here rather than through MyOrdersRenderer: that renderer swallows failures (leaving
	// `orders.data` undefined for the {#each}) and always requests page 1.
	let loading = $state(true)
	let error = $state('')
	let orders = $state<any>({})

	const currentPage = $derived(+(page.url.searchParams.get('page') || '1'))
	const noOfPage = $derived(Math.ceil((orders?.count || 0) / (orders?.pageSize || 20)))

	async function loadOrders() {
		try {
			loading = true
			error = ''
			orders = await orderService.list({ page: currentPage, q: '', sort: 'createdAt' })
		} catch (e: any) {
			console.error(e)
			orders = {}
			error = e?.message || 'We could not load your orders right now.'
		} finally {
			loading = false
		}
	}

	$effect(() => {
		// Re-fetch whenever ?page= changes.
		currentPage
		loadOrders()
	})

	const getStatusStyles = (status: string) => {
		switch (status?.toLowerCase()) {
			case 'delivered':
				return { bg: 'bg-success/10', text: 'text-success', ring: 'ring-success/40', dot: 'bg-success', icon: CheckCircle2 }
			case 'shipped':
				return { bg: 'bg-success/10', text: 'text-success', ring: 'ring-success/40', dot: 'bg-success', icon: Truck }
			case 'processing':
				return { bg: 'bg-warning/10', text: 'text-warning', ring: 'ring-warning/40', dot: 'bg-warning', icon: Clock }
			case 'cancelled':
				return { bg: 'bg-destructive/10', text: 'text-destructive', ring: 'ring-destructive/40', dot: 'bg-destructive', icon: XCircle }
			default:
				return { bg: 'bg-card', text: 'text-muted-foreground', ring: 'ring-border-strong', dot: 'bg-muted-foreground', icon: Package }
		}
	}

	const getPaymentStatusStyles = (status: string) => {
		switch (status?.toLowerCase()) {
			case 'paid':
				return { bg: 'bg-success/10', text: 'text-success', ring: 'ring-success/40', dot: 'bg-success' }
			case 'pending':
				return { bg: 'bg-warning/10', text: 'text-warning', ring: 'ring-warning/40', dot: 'bg-warning' }
			default:
				return { bg: 'bg-destructive/10', text: 'text-destructive', ring: 'ring-destructive/40', dot: 'bg-destructive' }
		}
	}
</script>

<svelte:head>
	<title>My Orders | Svelte Commerce</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-0 md:py-12 md:py-8">
	<!-- Header -->
	<div class="mb-7">
		<h1 class="text-lg font-bold tracking-tight text-foreground md:text-xl">Order History</h1>
		<p class="mt-2 text-sm text-muted-foreground">Check the status of recent orders and manage returns.</p>
	</div>

	{#if loading}
		<div class="flex min-h-[400px] items-center justify-center">
			<LoaderCircle class="h-8 w-8 animate-spin text-primary" />
		</div>
	{:else if error}
		<div in:fade class="flex flex-col items-center justify-center py-20 text-center">
			<div class="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-border bg-background shadow-sm">
				<AlertCircle class="h-10 w-10 text-destructive" />
			</div>
			<h2 class="text-2xl font-bold text-foreground">We couldn't load your orders</h2>
			<p class="mt-2 max-w-xs text-muted-foreground">{error}</p>
			<div class="mt-8">
				<Button onclick={loadOrders} class="h-12 px-8">Try again</Button>
			</div>
		</div>
	{:else if !orders?.data?.length}
		<div in:fade class="flex flex-col items-center justify-center py-20 text-center">
			<div class="relative mb-6">
				<div class="absolute inset-0 scale-150 animate-pulse rounded-full bg-card"></div>
				<div class="relative flex h-24 w-24 items-center justify-center rounded-full border border-border bg-background shadow-sm">
					<ShoppingBag class="h-10 w-10 text-faint-foreground" />
				</div>
			</div>
			<h2 class="text-2xl font-bold text-foreground">No orders yet</h2>
			<p class="mt-2 max-w-xs text-muted-foreground">Looks like you haven't placed any orders yet. Start shopping to see your history here.</p>
			<div class="mt-8">
				<Button href="/products" class="h-12 px-8">
					Start Shopping
					<ArrowRight class="ml-2 h-4 w-4" />
				</Button>
			</div>
		</div>
	{:else}
		<div class="space-y-8">
			{#each orders?.data || [] as order, i}
				{@const status = getStatusStyles(order.status)}
				{@const payment = getPaymentStatusStyles(order.paymentStatus)}

				<div in:fly={{ y: 20, duration: 400, delay: i * 50 }} class="overflow-hidden rounded-md border border-muted/30 bg-background">
					<!-- Order Header -->
					<div class="border-b border-border bg-muted/10 p-3">
						<div class="flex flex-wrap items-center justify-between gap-6">
							<div class="flex items-center gap-8">
								<div>
									<p class="text-xs font-bold text-faint-foreground">Order Number</p>
									<p class="mt-1.5 text-sm font-semibold text-foreground">#{order.orderNo || '_'}</p>
								</div>
								<div class="h-10 w-px bg-border"></div>
								<div>
									<p class="text-xs font-bold text-faint-foreground">Date Placed</p>
									<p class="mt-1.5 text-sm font-semibold text-foreground">{date(order.createdAt)}</p>
								</div>
								<div class="hidden h-10 w-px bg-border sm:block"></div>
								<div class="hidden sm:block">
									<p class="text-xs font-bold text-faint-foreground">Total</p>
									<!-- What the shopper was charged. Summing the lines gave the price before any
											     discount, so a coupon order showed more than the receipt. -->
									<p class="mt-1.5 text-sm font-semibold text-foreground">
										{formatPrice(order.total, page?.data?.store?.currency?.code)}
									</p>
								</div>
							</div>

							<div class="flex items-center gap-3">
								<Button variant="outline" size="sm" href="/my/orders/{order.parentOrderNo}" class="h-10 px-6">View Details</Button>
							</div>
						</div>

						<!-- Status Badges Mobile/Small -->
						<div class="mt-6 flex flex-wrap gap-3">
							<span
								class="inline-flex items-center gap-2 rounded-sm px-3 py-1 text-[10px] font-bold uppercase {status.bg} {status.text} ring-1 ring-inset {status.ring}"
							>
								<status.icon class="h-3.5 w-3.5" />
								{order.status}
							</span>
							<span
								class="inline-flex items-center gap-2 rounded-sm px-3 py-1 text-[10px] font-bold uppercase {payment.bg} {payment.text} ring-1 ring-inset {payment.ring}"
							>
								<CreditCard class="h-3.5 w-3.5" />
								Payment: {order.paymentStatus}
							</span>
						</div>
					</div>

					<!-- Order Items -->
					<div class=" bg-background">
						{#each order.lineItems as item}
							<div class="intra-gap group flex items-center p-3">
								<a href="/my/orders/{order.parentOrderNo}" class="relative shrink-0 overflow-hidden transition-transform duration-500">
									{#if item.thumbnail}
										<!-- <LazyImg
													src={item.thumbnail}
													alt={item.title}
													aspectRatio="5:6"
													height="96"
													width="80"
													class="h-full w-full object-cover object-center"
												/> -->
										<LazyImg src={item.thumbnail} alt={item.title} class="aspect-[3/4] w-24 object-contain sm:w-16" />
									{:else}
										<div class="flex h-full w-full items-center justify-center bg-card">
											<ShoppingBag class="h-8 w-8 text-faint-foreground" />
										</div>
									{/if}
								</a>

								<div class="flex flex-1 flex-col">
									<div class="flex items-start justify-between gap-4">
										<div>
											<h3 class=" text-xs font-medium text-foreground sm:text-sm">
												<a href="/my/orders/{order.parentOrderNo}" class="transition-colors hover:text-muted-foreground">
													{item.title || '_'}
												</a>
											</h3>
											<div class="mt-2 flex items-center gap-4 text-xs font-bold uppercase text-faint-foreground">
												<span class="flex items-center gap-1.5">
													<Tag class="h-3.5 w-3.5" />
													Qty: {item.qty || '_'}
												</span>
												{#if item.variantTitle}
													<span class="h-1 w-1 rounded-full bg-border"></span>
													<span>{item.variantTitle}</span>
												{/if}
											</div>
										</div>
										<p class="text-sm font-semibold text-foreground md:text-base">
											{formatPrice(item.total, page?.data?.store?.currency?.code)}
										</p>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>

		<Pagination {noOfPage} />
	{/if}
</div>

<style>
	:global(body) {
		background-color: hsl(var(--card));
	}
</style>
