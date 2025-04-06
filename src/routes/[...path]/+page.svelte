<script lang="ts">
  import type { PageProps } from './$types';
  import type { ComponentProps } from '$lib/ssg/types';
  import getComponent from '$lib/ssg/component.loader';

  let { data }: PageProps = $props();
</script>

{#each data.components as content}
  {@const { component, ...props } = content}
  {@const Component = getComponent(component)}
  <Component {...props as ComponentProps<typeof content>} />
{/each}
