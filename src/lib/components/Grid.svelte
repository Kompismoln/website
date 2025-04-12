<script module>
  import { z, ze } from 'compis/schemas';

  export const schema = ze.content({
    intro: ze.component(['Blurb']),
    items: z.array(ze.component(['Card']))
  });
</script>

<script lang="ts">
  import { resolveComponent } from 'compis/component.loader';
  let { intro, items } = $props();
  const Intro = resolveComponent(intro);
</script>

<div class="min-h-[60vh]">
  <div class="px-7 pt-20 pb-8">
    <Intro.component {...Intro.props} />
    <div
      class="mx-auto mt-12 flex max-w-[1064px] flex-wrap place-content-center gap-6"
    >
      {#each items as item}
        {@const Item = resolveComponent(item)}
        <Item.component {...Item.props} />
      {/each}
    </div>
  </div>
</div>
