<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { Drawer as DrawerPrimitive } from 'vaul-svelte'

	type $$Props = DrawerPrimitive.Props
	export let shouldScaleBackground: $$Props['shouldScaleBackground'] = true
	export let open: $$Props['open'] = false
	export let activeSnapPoint: $$Props['activeSnapPoint'] = undefined
	export let manageHistory: boolean = true

	const modalHistoryKey = '__svelteCommerceDrawer'
	let ownsHistoryEntry = false

	// vaul-svelte finishes a close on a 300ms timer that it never cancels, so a drawer reopened
	// inside that window (close, then click the trigger again) is shut by the stale timer a moment
	// after it opens. Hold such a reopen until the old close has run, then open for real.
	const CLOSE_SETTLE_MS = 320
	let primitiveOpen = open
	let lastOpen = open
	let lastPrimitive = primitiveOpen
	let closedAt = -Infinity
	let reopenTimer: ReturnType<typeof setTimeout> | undefined

	function setPrimitive(value: boolean) {
		if (lastPrimitive && !value) closedAt = performance.now()
		primitiveOpen = lastPrimitive = value
	}

	// One statement reconciles both directions, so the order Svelte runs them in can't matter.
	function reconcile(wanted: boolean | undefined, shown: boolean | undefined) {
		if (shown !== lastPrimitive) {
			// vaul changed it itself (a Trigger, Escape, the overlay, a Close button): hand that back
			// to the prop. Opens made through a Trigger skip the reopen guard below; a drawer that
			// can be reopened right after closing should open through `open` instead.
			lastPrimitive = shown
			if (!shown) {
				closedAt = performance.now()
				if (wanted && !reopenTimer) wanted = open = false
			} else if (!wanted) {
				wanted = open = true
			}
		}
		if (wanted === lastOpen) return
		lastOpen = wanted
		clearTimeout(reopenTimer)
		reopenTimer = undefined
		if (!wanted) return setPrimitive(false)
		if (primitiveOpen) return
		const wait = closedAt + CLOSE_SETTLE_MS - performance.now()
		if (wait <= 0) return setPrimitive(true)
		reopenTimer = setTimeout(() => {
			reopenTimer = undefined
			if (open) setPrimitive(true)
		}, wait)
	}

	$: reconcile(open, primitiveOpen)

	function handleBrowserBack() {
		if (!open || !ownsHistoryEntry) return
		ownsHistoryEntry = false
		open = false
	}

	onMount(() => {
		window.addEventListener('popstate', handleBrowserBack)
		return () => window.removeEventListener('popstate', handleBrowserBack)
	})

	$: if (typeof window !== 'undefined' && manageHistory) {
		if (open && !ownsHistoryEntry) {
			history.pushState({ ...history.state, [modalHistoryKey]: true }, '', window.location.href)
			ownsHistoryEntry = true
		} else if (!open && ownsHistoryEntry) {
			const isCurrentModalEntry = history.state?.[modalHistoryKey] === true
			ownsHistoryEntry = false
			if (isCurrentModalEntry) history.back()
		}
	}

	onDestroy(() => {
		clearTimeout(reopenTimer)
		if (typeof window !== 'undefined' && manageHistory && ownsHistoryEntry && history.state?.[modalHistoryKey] === true) {
			history.back()
		}
	})
</script>

<DrawerPrimitive.Root {shouldScaleBackground} bind:open={primitiveOpen} bind:activeSnapPoint {...$$restProps}>
	<slot />
</DrawerPrimitive.Root>
