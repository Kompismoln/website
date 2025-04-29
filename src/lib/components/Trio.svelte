<script module>
  import { c } from 'composably/schemas';

  export const schema = c.content({
    title: c.string(),
    panes: c.array(c.component(['Card', 'Preview'])).length(3)
  });
</script>

<script lang="ts">
  let { title, panes } = $props();
</script>

<div class="text-center">
  <div
    class="mx-auto grid max-w-screen-lg grid-cols-1 overflow-x-auto md:grid-cols-3"
  >
    {#each panes as pane}
      <pane.component {...pane} />
    {/each}
  </div>
</div>
