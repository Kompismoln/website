<script lang="ts">
  import type { LayoutProps } from './$types';
  import '../../app.css';
  import config from '$lib/config';
  import { page } from '$app/state';
  import { resolveComponent } from '$lib/ssg/component.loader';

  const Head = $derived(
    resolveComponent({
      component: 'Head',
      siteName: config.siteName,
      pageName: page.data.title,
      siteUrl: config.siteUrl,
      siteDescription: config.siteDescription
    })
  );

  const Nav = resolveComponent({
    component: 'Nav',
    logo: config.logo,
    searchPage: config.searchPage,
    menu: config.menu
  });

  const Footer = resolveComponent({
    component: 'Footer',
    logo: config.logo,
    license: config.license,
    socials: config.socials
  });

  let { children }: LayoutProps = $props();
</script>

<Head.component {...Head.props} />

<Nav.component {...Nav.props} />

<div class="">
  {@render children()}
</div>

<Footer.component {...Footer.props} />
