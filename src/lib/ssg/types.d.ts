import type { SvelteComponent } from 'svelte';

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

export interface ComponentMap {
  [name: string]: typeof SvelteComponent;
}
