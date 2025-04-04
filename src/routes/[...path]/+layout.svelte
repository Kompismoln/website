<script lang="ts">
  import type { LayoutProps } from './$types';
  import '../../app.css';
  import Head from '$lib/components/Head.svelte';
  import Nav from '$lib/components/Nav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import config from '$lib/config';

  let { children }: LayoutProps = $props();
</script>

<Head
  siteName={config.siteName}
  siteUrl={config.siteUrl}
  siteDescription={config.siteDescription}
/>

<Nav logo={config.logo} searchPage={config.searchPage} menu={config.menu} />

<div class="">
  {@render children()}
</div>

<Footer logo={config.logo} license={config.license} socials={config.socials} />
