import type {
  ComponentMap,
  ComponentContent,
  ResolvedComponent
} from './types';

/* Import all svelte components in $components
 * Vite's glob import doesn't allow dynamic strings so we can't interpolate
 * component root here, hence the $components alias.
 * eager is true because it makes resolveComponent sync and easier to use.
 * The inference of componentRoot and stripPrefix hacks means that components
 * are named after their uniqe name in their component paths. Putting all components
 * in a subfolder above $commponents will make this path differ from $components.
 */
const componentMap = (() => {
  const modules = import.meta.glob('$components/**/*.svelte', {
    eager: true
  }) as ComponentMap;
  const componentRoot = inferComponentRoot(Object.keys(modules));
  return stripPrefix(modules, componentRoot);
})(); // Note the self invocation

function stripPrefix(obj: ComponentMap, prefix: string) {
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
const getComponent = (name: string) => {
  if (!(name in componentMap)) {
    throw new Error(`Component not found: ${name}`);
  }
  return componentMap[name];
};

/* Take content for a component, validate it if it exports a schema and return
 * the imported component module together with its props.
 */
export const resolveComponent = (
  content: ComponentContent
): ResolvedComponent => {
  const { component: name, ...props } = content;
  const { default: component } = getComponent(name);

  return { component, props };
};

/* Make content adhere to their schema and parse all markdown types with remark.
 * This should only run serverside.
 */
export const conformComponent = async (
  content: ComponentContent
): Promise<void> => {
  let { schema } = getComponent(content.component);

  try {
    Object.assign(content, await schema.parseAsync(content));
  } catch (error: any) {
    throw new Error(
      `Component '${content.component}' failed validation: ${error.message}`
    );
  }
};
