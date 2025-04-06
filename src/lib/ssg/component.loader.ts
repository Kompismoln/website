import type { ComponentMap, ComponentContent, ResolvedComponent } from '$lib/ssg/types';
import config from '$lib/config';

export const componentMap = import.meta.glob('$components/**/*.svelte', {
  eager: true,
  import: 'default'
}) as ComponentMap;

export const resolveComponent = (content: ComponentContent): ResolvedComponent => {
  const { component, ...props } = content;
  return {
    component: componentMap[`/${config.componentRoot}/${component}.svelte`],
    props
  };
};
