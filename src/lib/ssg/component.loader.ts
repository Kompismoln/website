import type { SvelteComponent } from 'svelte';

export default import.meta.glob('$components/**/*.svelte', {
  eager: true,
  import: 'default'
}) as Record<string, typeof SvelteComponent>;
