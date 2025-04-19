import type { ResolvedComponent } from './types';
import { onMount, mount } from 'svelte';

/* Slots are components that attaches to a placeholder on mount.
 * Markdown parser render these placeholders.
 * This hook replaces them with the component.
 *
 * Usage:
 * mountSlots(slots)
 */
export function mountSlots(slots: Record<string, ResolvedComponent>) {
  onMount(() => {
    for (const key in slots) {
      const { component, props } = slots[key];
      const target = document.querySelector(`[data-slot="${key}"]`);

      if (target) {
        target.innerHTML = '';
        mount(component, { target, props });
      }
    }
  });
}
