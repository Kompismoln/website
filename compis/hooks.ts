import type { ResolvedComponent } from './types';
import { onMount, mount } from 'svelte';

export function mountSlots(slots: ResolvedComponent[]) {
  onMount(() => {
    for (const key in slots) {
      const { component, props } = slots[key];
      const target = document.querySelector(`[data-slot="${key}"]`);

      if (!target) {
        continue;
      }

      target.innerHTML = '';
      mount(component, { target, props });
    }
  });
}
