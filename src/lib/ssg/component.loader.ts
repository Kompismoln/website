import type { ComponentMap, ComponentContent, ResolvedComponent } from '$lib/ssg/types';
import config from '$lib/config';

export const componentMap = import.meta.glob('$components/**/*.svelte', {
  eager: true
}) as ComponentMap;

export const resolveComponent = (content: ComponentContent): ResolvedComponent => {
  const { component: name, ...props } = content;
  const path = `/${config.componentRoot}/${name}.svelte`;
  const { default: component, schema } = componentMap[path];

  if (!component) throw new Error(`Component not found: ${name}`);

  if (schema) {
    schema.parse(props);
  }

  return { component, props };
};
