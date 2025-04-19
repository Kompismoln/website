import type {
  ComponentMap,
  ComponentContent,
  ResolvedComponent,
  PageContent
} from './types';

import { contentTraverser } from './utils';

/* Import all svelte components in $components
 * Vite's glob import doesn't allow dynamic strings so we can't interpolate
 * component root here, hence the $components alias.
 * eager is true because it makes resolveComponent sync and easier to use.
 * The inference of componentRoot and stripPrefix hacks means that components
 * are named after their uniqe name in their component paths. Putting all components
 * in a subfolder above $commponents will make this path differ from $components.
 */
const componentMap: ComponentMap = (() => {
  const modules = import.meta.glob('$components/**/*.svelte');
  const componentRoot = inferComponentRoot(Object.keys(modules));
  return stripPrefix(modules, componentRoot);
})(); // Note the self invocation

function stripPrefix(obj: Record<string, any>, prefix: string) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [
      key.slice(prefix.length, key.length - '.svelte'.length),
      val
    ])
  );
}

function inferComponentRoot(arr: string[]) {
  return arr.reduce((prefix, str) => {
    let i = 0;
    while (i < prefix.length && prefix[i] === str[i]) i++;
    return prefix.slice(0, i);
  });
}

/* This wrapper is just for error handling so far, but it feels safe to
 * keep the wrapping
 */
const getComponent = async (name: string) => {
  if (!(name in componentMap)) {
    throw new Error(`Component not found: ${name}`);
  }
  const component = await componentMap[name]();
  return component;
};

/* Take content for a component, validate it if it exports a schema and return
 * the imported component module together with its props.
 */
export const resolveComponent = async (
  content: ComponentContent
): Promise<ResolvedComponent> => {
  const { component: name, ...props } = content;
  const { default: component } = await getComponent(name);
  return { component, props };
};

/* Make content adhere to their schema and parse all markdown types with remark.
 * This should only run serverside.
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

export const resolvePage = async (page: PageContent) => {
  return await contentTraverser({
    obj: page,
    filter: (obj) => 'component' in obj,
    callback: (obj) => resolveComponent(obj)
  });
};
