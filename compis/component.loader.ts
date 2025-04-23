import type {
  ComponentMap,
  ComponentContent,
  ResolvedComponent,
  PageContent
} from './types';

import { createRawSnippet } from 'svelte';
import { contentTraverser, inferCommonPath, trimKey } from './utils';

/**
 * The component loader
 *
 * Convenience functions to maintain and access a dynamic map of all components.
 *
 * Pages pick the components they need and the rest aren't loaded,
 * so bundle is kept minimal, just as with static loading.
 */

/* A lazy map of all components expected by content
 */
let componentMap: ComponentMap;

/* Reduce keys to friendly component names like 'Hero' or 'Blog/Post',
 * instead of full paths like:
 *
 * /src/lib/components/Hero.svelte or
 * /src/lib/components/Blog/Post.svelte
 *
 * Usage:
 * Set statically in page.ts for universal resolution, e.g:
 * setComponentMap(import.meta.glob('$lib/components/**\/*.svelte'));
 */
export function setComponentMap(
  modules: Record<string, () => Promise<unknown>>
) {
  const componentRoot = inferCommonPath(Object.keys(modules));
  componentMap = trimKey(modules, componentRoot.length, '.svelte'.length);
}

/* How everyone in here should get a component from componentMap
 */
export const getComponent = async (name: string) => {
  if (!Object.keys(componentMap).length) {
    throw new Error(
      'Component map is empty. Did you forget to call setComponentMap()?'
    );
  }
  if (!(name in componentMap)) {
    throw new Error(`Component not found: ${name}`);
  }
  const component = await componentMap[name]();
  return component;
};

/* Get module with props in a neat package
 * (to minimize boilerplate in componentes)
 *
 * "ResolvedComponent" is maybe not the best name for a data type that is literally
 * an unresolved component. ¯\_(ツ)_/¯
 */
export const resolveComponent = async (
  content: ComponentContent
): Promise<ResolvedComponent> => {
  const { component: name, ...props } = content;
  const { default: component } = await getComponent(name);
  return { component, props };
};

/* Resolve all components in a page, reattach page properties if page is
 * a component.
 *
 * The title assignment looks out of place because it is,
 * also if the page is not a component, the title will be
 * untouched and the assignment isn't even needed.
 *
 * Let's see what properties a page may need before we go nuts here.
 */
export const resolvePage = async (page: PageContent) => {
  const title = page.title;

  page = await contentTraverser({
    obj: page,
    filter: (obj) => 'component' in obj,
    callback: (obj) => resolveComponent(obj)
  });
  page = await contentTraverser({
    obj: page,
    filter: (obj) => 'html' in obj,
    callback: (obj) => {
      obj.snippet = createRawSnippet(() => ({
        render() {
          return `<div>${obj.html}</div>`;
        }
      }));
      return obj;
    }
  });

  page.title = title;
  return page;
};

/* Validate and transform content
 *
 * This should only run serverside because schema.spa will pull in the whole unified
 * shenanigan if it encounters a markdown field.
 *
 * In fact, this function may not even belong here and should be in content
 * loader or something.
 *
 * Also, what's with "conform"? Who writes that?
 *
 * Maybe just pay the price for writing a function that does two things and name it
 * validateAndTransformComponent. <- Actually not a bad idead.
 */
export const conformComponent = async (
  content: ComponentContent
): Promise<ComponentContent> => {
  let { schema } = await getComponent(content.component);

  const result = await schema.spa(content);

  if (!result.success) {
    throw new Error(
      `Component '${content.component}' failed validation: ${result.error.message}`
    );
  }
  return result.data;
};
