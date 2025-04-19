<script module>
  import { z, ze } from 'compis/schemas';

  export const schema = ze.content({
    title: z.string(),
    panes: z.array(ze.component(['Card', 'Preview'])).length(3)
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
      <pane.component {...pane.props} />
    {/each}
  </div>
</div>
