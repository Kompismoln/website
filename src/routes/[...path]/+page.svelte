<script lang="ts">
  import type { PageProps } from './$types';
  import components from '$lib/ssg/component.loader';
  import config from '$lib/config';

  let { data }: PageProps = $props();
</script>

{#each data.sections as content}
  {@const Component = components[`/${config.componentRoot}/${content.component}.svelte`]}
  <Component {...(({ component, ...rest }) => rest)(content)} />
{/each}
