import type { ComponentMap, ComponentContent, ResolvedComponent } from '$lib/ssg/types';
import config from '$lib/ssg/config';

/* Import all svelte components in $components
 * Vite's glob import doesn't allow dynamic strings so we can't interpolate
 * config.componentRoot here, hence the $components alias.
 * eager is true because it makes resolveComponent sync and easier to use.
 */
const componentMap = import.meta.glob('$components/**/*.svelte', {
  eager: true
}) as ComponentMap;

/* Take content for a component, validate it if it exports a schema and return
 * the imported component module together with its props.
 */
export const resolveComponent = (content: ComponentContent): ResolvedComponent => {
  const { component: name, ...props } = content;
  const path = `/${config.componentRoot}/${name}.svelte`;

  if (!(path in componentMap)) {
    throw new Error(`Component not found: ${name}`);
  }
  const { default: component, schema } = componentMap[path];

  if (schema) {
    /* throws error on invalid or unexpected props */
    schema.strict().parse(props);
  }

  return { component, props };
};
