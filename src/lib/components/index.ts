import type { SvelteComponent } from 'svelte';

const modules: Record<string, { default: typeof SvelteComponent }> = import.meta.glob(
  '/src/lib/components/**/*.svelte',
  { eager: true }
);

export function getComponent(name: string) {
  return modules[`/src/lib/components/${name}.svelte`]?.default;
}
