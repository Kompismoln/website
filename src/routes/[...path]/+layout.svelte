<script lang="ts">
  import type { LayoutProps } from './$types';
  import 'highlight.js/styles/atom-one-dark.css';

  import '../../app.css';
  import config from '$lib/config';
  import { page } from '$app/state';

  import Head from '$lib/components/Head.svelte';
  import Nav from '$lib/components/Nav.svelte';
  import Footer from '$lib/components/Footer.svelte';

  const head = $derived({
    siteName: config.siteName,
    pageName: page.data.title,
    pagePath: page.url.pathname,
    siteUrl: config.siteUrl,
    siteDescription: config.siteDescription
  });

  const nav = {
    logo: config.logo,
    searchPage: config.searchPage,
    menu: config.menu,
    themes: config.themes
  };

  const footer = {
    logo: config.logo,
    license: config.license,
    socials: config.socials
  };

  let { children }: LayoutProps = $props();
</script>

<Head {...head} />
<Nav {...nav} />

<main class="pt-8 md:pt-24">
  {@render children()}
</main>

<Footer {...footer} />
