<script lang="ts">
  import type { LayoutProps } from './$types';
  import '../app.css';
  import Nav from '$lib/components/Nav.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { data, children }: LayoutProps = $props();
</script>

<Nav content={data.sections.nav} />

<div class="">
  {@render children()}
</div>

<Footer />
