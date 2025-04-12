<script lang="ts">
  import type { ComponentContent } from './types';
  import { resolveComponent } from './component.loader';
  let page = $props();
</script>

{#if page.component}
  {@const { component: C, props } = resolveComponent(page as ComponentContent)}
  <C {...props} />
{/if}
{#if page.components}
  {#each page.components as component}
    {@const { component: C, props } = resolveComponent(component)}
    <C {...props} />
  {/each}
{/if}
