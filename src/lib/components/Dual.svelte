<script module>
  import { c } from 'composably/schemas';

  export const schema = c.content({
    title: c.string(),
    panes: c.array(c.component(['Card', 'Mockup', 'Preview'])).length(2)
  });
</script>

<script lang="ts">
  let { title, panes } = $props();
</script>

<div class="hero mt-12 min-h-[60vh]">
  <div class="hero-content px-4 pt-4 pb-16 text-center">
    <div class="max-w-lg">
      <div
        class="
        title
        mt-4
        "
      >
        {title}
      </div>
      <div
        class="mt-6 flex flex-col place-content-center content-center gap-6 lg:flex-row"
      >
        {#each panes as pane, key (key)}
          <pane.component {...pane} />
        {/each}
      </div>
    </div>
  </div>
</div>
