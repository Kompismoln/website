<script lang="ts">
  import type { LayoutProps } from './$types';
  import '../../app.css';
  import Head from '$lib/components/Head.svelte';
  import Nav from '$lib/components/Nav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import content from '$lib/config';

  let { children }: LayoutProps = $props();
</script>

<Head {content} />
<Nav {content} />

<div class="">
  {@render children()}
</div>

<Footer {content} />
