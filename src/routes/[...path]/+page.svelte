<script lang="ts">
  import type { PageProps } from './$types';
  import Page from 'composably/Page.svelte';
  let { data }: PageProps = $props();
</script>

<Page {...data} />
