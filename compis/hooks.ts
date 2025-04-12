import type { ComponentContent } from './types';
import { resolveComponent } from './component.loader';
import { onMount, mount } from 'svelte';

export function mountSlots(slots: ComponentContent[]) {
  onMount(() => {
    for (const key in slots) {
      const { component, props } = resolveComponent(slots[key]);
      const target = document.querySelector(`[data-slot="${key}"]`);

      if (!target) {
        continue;
      }

      target.innerHTML = '';
      mount(component, { target, props });
    }
  });
}
