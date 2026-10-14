<script lang="ts">
	import PageTitle from '$lib/components/seo/page-title.svelte'
	import CmsPage from '../_cms-page.svelte'
	import Canonical from '$lib/components/seo/canonical.svelte'
	import Blocks from '$lib/components/page-blocks/blocks.svelte'
	import type { PageProps } from './$types'

	let { data }: PageProps = $props()
</script>

<PageTitle title="Terms & conditions" />

<CmsPage title="Terms & conditions" content={data?.page?.content} />

<Blocks layouts={data?.page?.layouts} />

<Canonical />
