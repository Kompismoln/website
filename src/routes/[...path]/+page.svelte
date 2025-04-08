<script lang="ts">
  import type { PageProps } from './$types';
  import type { ComponentContent } from '$lib/ssg/types';
  import { resolveComponent } from '$lib/ssg/component.loader';

  let { data }: PageProps = $props();
</script>

{#if data.component}
  {@const { component: C, props } = resolveComponent(data as ComponentContent)}
  <C {...props} />
{:else}
  {#each data.components as content}
    {@const { component: C, props } = resolveComponent(content)}
    <C {...props} />
  {/each}
{/if}
