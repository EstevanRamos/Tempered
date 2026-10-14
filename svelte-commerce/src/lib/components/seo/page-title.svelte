<script lang="ts">
	// The document title for pages that don't render a SeoHeader (checkout, account, policies),
	// in the Storefront's one pattern, "Name | Store" (brand-title.ts).
	import { page } from '$app/state'
	import { brandTitle } from './brand-title.js'

	let { title }: { title: string } = $props()
</script>

<svelte:head>
	<title>{brandTitle(title, page.data?.store?.name)}</title>
</svelte:head>
