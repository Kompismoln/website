import type { ComponentMap, ComponentContent, ResolvedComponent } from '$lib/ssg/types';
import config from '$lib/config';

export const componentMap = import.meta.glob('$components/**/*.svelte', {
  eager: true,
  import: 'default'
}) as ComponentMap;

export const resolveComponent = (content: ComponentContent): ResolvedComponent => {
  const { component: name, ...props } = content;
  const path = `/${config.componentRoot}/${name}.svelte`;
  const component = componentMap[path];

  if (!component) throw new Error(`Component not found: ${name}`);

  return { component, props };
};
