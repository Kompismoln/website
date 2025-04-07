<script module>
  import z from 'zod';
  import { z_component } from '$lib/ssg/schemas';

  export const schema = z.object({
    title: z.string(),
    slotA: z_component('Card', 'Mockup', 'Preview'),
    slotB: z_component('Card', 'Mockup', 'Preview')
  });
</script>

<script lang="ts">
  import { resolveComponent } from '$lib/ssg/component.loader';
  let { title, slotA, slotB } = $props();

  const SlotA = resolveComponent(slotA);
  const SlotB = resolveComponent(slotB);
</script>

<div class="hero mt-12 min-h-[60vh]">
  <div class="hero-content px-4 pt-4 pb-16 text-center">
    <div class="max-w-lg">
      <div
        class="
        mt-4
        pb-2
        text-3xl
        font-bold
        md:text-5xl
        "
      >
        {title}
      </div>
      <div class="mt-6 flex flex-col place-content-center content-center gap-6 lg:flex-row">
        <SlotA.component {...SlotA.props} />
        <SlotB.component {...SlotB.props} />
      </div>
    </div>
  </div>
</div>
