import type { ComponentType } from 'svelte';
import type { ZodObject } from 'zod';

export interface Fragment {
  [key: string]: unknown;
}

/* The component string should be a path to a file in $components (src/lib/components/) without
 * leading slash. Everything else is props.
 */
export interface ComponentContent {
  component: string;
  [key: string]: unknown;
}

/* Just the props without the component attribute..
 * (like ComponentContent but without the component name, because it's not a prop)
 */
export type ComponentProps<T extends ComponentContent> = Omit<T, 'component'>;

/* The data from some content file in src/lib/content
 */
export interface PageContent {
  title: string;
  components?: ComponentContent[];
}

/* A record of page content indexed by their site path.
 */
export type SiteContent = Record<string, PageContent>;

/* Shape of the return value of vite's glob, a ComponentMap of ComponentModules.
 */
type ComponentModule = {
  default: ComponentType;
  schema?: ZodObject;
};
export type ComponentMap = Record<string, ComponentModule>;

/* A component module together with its props, ready to be rendered by svelte. */
export interface ResolvedComponent<T extends ComponentContent = ComponentContent> {
  component: ComponentType;
  props: ComponentProps<T>;
}
