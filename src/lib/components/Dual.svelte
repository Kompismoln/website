<script module>
  import z from 'zod';
  import ze from '$lib/ssg/schemas';

  const allowedComponents = ['Card', 'Mockup', 'Preview'] as const;

  export const schema = z.object({
    title: z.string(),
    slots: z.array(ze.component(...allowedComponents)).length(2)
  });
</script>

<script lang="ts">
  import { resolveComponent } from '$lib/ssg/component.loader';
  let { title, slots } = $props();

  const SlotA = resolveComponent(slots[0]);
  const SlotB = resolveComponent(slots[1]);
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
