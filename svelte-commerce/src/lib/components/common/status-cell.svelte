<script lang="ts">
	import { Undo, Package2 } from '@lucide/svelte'

	let { value }: { value?: string } = $props()

	const isPositiveStatus = $derived(
		value?.toLowerCase() === 'active' ||
			value?.toLowerCase() === 'true' ||
			value?.toLowerCase() === 'yes' ||
			value?.toLowerCase() === 'fulfilled' ||
			value?.toLowerCase() === 'paid' ||
			value?.toLowerCase() === 'delivered' ||
			value?.toLowerCase() === 'published' ||
			value?.toLowerCase() === 'confirmed'
	)
	const isWarningStatus = $derived(value?.toLowerCase() === 'processing' || value?.toLowerCase() === 'unpaid')
	const isPartiallyPaid = $derived(value?.toLowerCase() === 'partially_paid')
	const isAuthorized = $derived(value?.toLowerCase() === 'authorized')
	const isPending = $derived(value?.toLowerCase() === 'pending')
	const isFulfilling = $derived(value?.toLowerCase() === 'fulfilling')
	const isInfoStatus = $derived(value?.toLowerCase() === 'shipped')
	const isRefunded = $derived(value?.toLowerCase() === 'refunded')
	const isErrorStatus = $derived(
		value?.toLowerCase() === 'failed' ||
			value?.toLowerCase() === 'error' ||
			value?.toLowerCase() === 'cancelled' ||
			value?.toLowerCase() === 'rejected' ||
			value?.toLowerCase() === 'false'
	)

	// Four tones from the theme's tokens, the word always carrying the meaning: positive (paid,
	// shipped, delivered, in progress), warning (awaiting money, refunded), danger (failed,
	// cancelled) and neutral (pending, anything unknown).
	const tone = $derived(
		isErrorStatus
			? 'danger'
			: isWarningStatus || isPartiallyPaid || isRefunded
				? 'warning'
				: isPositiveStatus || isAuthorized || isInfoStatus || isFulfilling
					? 'positive'
					: 'neutral'
	)
	const TONES: Record<string, { pill: string; dot: string }> = {
		positive: { pill: 'bg-success/10 text-success ring-success/40', dot: 'bg-success' },
		warning: { pill: 'bg-warning/10 text-warning ring-warning/40', dot: 'bg-warning' },
		danger: { pill: 'bg-destructive/10 text-destructive ring-destructive/40', dot: 'bg-destructive' },
		neutral: { pill: 'bg-card text-muted-foreground ring-border-strong', dot: 'bg-muted-foreground' }
	}
</script>

{#if value}
	<span class="inline-flex items-center gap-1 rounded-sm px-2.5 py-0.5 text-xs font-medium uppercase ring-1 ring-inset {TONES[tone].pill}">
		{#if isRefunded}
			<Undo class="h-3 w-3" />
		{:else if isFulfilling}
			<Package2 class="h-3 w-3" />
		{:else}
			<span class="relative mr-1 flex h-1.5 w-1.5">
				<span class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 {TONES[tone].dot}"></span>
				<span class="relative inline-flex h-1.5 w-1.5 rounded-full {TONES[tone].dot}"></span>
			</span>
		{/if}
		{value}
	</span>
{/if}
