<script module>
  import { c } from 'composably/schemas';

  export const schema = c.content({
    siteName: c.string(),
    pageName: c.string().optional(),
    pagePath: c.string(),
    siteUrl: c.string(),
    siteDescription: c.string()
  });
</script>

<script lang="ts">
  let { siteName, pageName, pagePath, siteUrl, siteDescription } = $props();
  const ldJson = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl
  };
  const jsonldScript = `<script type="application/ld+json">${JSON.stringify(ldJson) + '<'}/script>`;
</script>

<svelte:head>
  <title>{siteName} - {pageName}</title>
  <meta name="description" content={siteDescription} />
  <link rel="canonical" href={`${siteUrl}${pagePath}`} />

  {@html jsonldScript}
</svelte:head>
