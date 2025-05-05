<script lang="ts">
  /* The default page component contract.
   * Should agree with PageContent in types.d.ts
   */
  let page = $props();
</script>

{#if page.component}
  <page.component {...page} />
{/if}
{#if page.components}
  {#each page.components as section, key (key)}
    <section.component {...section} />
  {/each}
{/if}
