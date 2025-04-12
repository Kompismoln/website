<script lang="ts">
  import type { PageProps } from './$types';
  import Page from 'compis/Page.svelte';
  let { data }: PageProps = $props();
</script>

<Page {...data} />
