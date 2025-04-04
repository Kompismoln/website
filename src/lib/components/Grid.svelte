<script lang="ts">
  import Intro from '$lib/components/Intro.svelte';
  import Card from '$lib/components/Card.svelte';
  let { body, list } = $props();
</script>

<div class="min-h-[60vh]">
  <div class="px-7 pt-20 pb-8">
    <Intro {body} />
    <div class="mx-auto mt-12 flex max-w-[1064px] flex-wrap place-content-center gap-6">
      {#each list as item}
        <Card {...item} />
      {/each}
    </div>
  </div>
</div>
