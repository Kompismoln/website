<script module>
  import { c } from 'composably/schemas';

  export const schema = c.content({
    intro: c.component(['Blurb']),
    items: c.array(c.component(['Card']))
  });
</script>

<script lang="ts">
  let { intro, items } = $props();
</script>

<div class="min-h-[60vh]">
  <div class="px-7 pt-20 pb-8">
    <intro.component {...intro.props} />
    <div
      class="mx-auto mt-12 flex max-w-[1064px] flex-wrap place-content-center gap-6"
    >
      {#each items as item}
        <item.component {...item.props} />
      {/each}
    </div>
  </div>
</div>
