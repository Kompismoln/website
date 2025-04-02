<script lang="ts">
  import type { PageProps } from './$types';
  import Hero from '$lib/components/Hero.svelte';
  import Swipe from '$lib/components/Swipe.svelte';
  import Dual from '$lib/components/Dual.svelte';

  let { data }: PageProps = $props();
</script>

<Hero content={data.sections.hero} />
<Swipe content={data.sections.prospects} />
<Dual />
