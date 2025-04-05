<script lang="ts">
  import type { PageProps } from './$types';
  import components from '$lib/ssg/component.loader';
  import config from '$lib/config';

  let { data }: PageProps = $props();
  let getComponent = (name: string) => components[`/${config.componentRoot}/${name}.svelte`];
</script>

{#each data.sections as content}
  {@const Component = getComponent(content.component)}
  <Component {...(({ component, ...rest }) => rest)(content)} />
{/each}
