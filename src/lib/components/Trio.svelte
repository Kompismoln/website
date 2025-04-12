<script module>
  import { z, ze } from 'compis/schemas';

  export const schema = ze.content({
    title: z.string(),
    slots: z.array(ze.component(['Card', 'Preview'])).length(3)
  });
</script>

<script lang="ts">
  import { resolveComponent } from 'compis/component.loader';
  let { title, slots } = $props();
</script>

<div class="text-center">
  <div
    class="mx-auto grid max-w-screen-lg grid-cols-1 overflow-x-auto md:grid-cols-3"
  >
    {#each slots as slot}
      {@const Slot = resolveComponent(slot)}
      <Slot.component {...Slot.props} />
    {/each}
  </div>
</div>
