import type { ComponentType } from 'svelte';
import type { ZodSchema } from 'zod';

export interface ComponentContent {
  component: string;
  [key: string]: unknown;
}

export type ComponentProps<T extends ComponentContent> = Omit<T, 'component'>;

export interface PageContent {
  title: string;
  components: ComponentContent[];
}

export type SiteContent = Record<string, PageContent>;

type ComponentModule = {
  default: ComponentType;
  schema?: ZodSchema<any>;
};

export type ComponentMap = Record<string, ComponentModule>;

export interface ResolvedComponent<T extends ComponentContent = ComponentContent> {
  component: ComponentType;
  props: ComponentProps<T>;
}
