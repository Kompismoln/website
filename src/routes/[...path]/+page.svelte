<script lang="ts">
  import type { PageProps } from './$types';
  import { resolveComponent } from '$lib/ssg/component.loader';

  let { data }: PageProps = $props();
</script>

{#each data.components as content}
  {@const { component: C, props } = resolveComponent(content)}
  <C {...props} />
{/each}
