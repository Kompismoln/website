<script lang="ts">
  import type { PageProps } from './$types';
  import { getComponent } from '$lib/components/index';

  let { data }: PageProps = $props();
</script>

{#each data.sections as content}
  {@const Component = getComponent(content.component)}
  <Component {content} />
{/each}
