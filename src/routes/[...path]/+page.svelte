<script lang="ts">
  import type { PageProps } from './$types';
  import Page from '$lib/components/Page.svelte';
  let { data }: PageProps = $props();
</script>

<Page {...data} />
