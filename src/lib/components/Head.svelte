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
</script>

<svelte:head>
  <title>{siteName} - {pageName}</title>
  <meta name="description" content={siteDescription} />
  <link rel="canonical" href={`${siteUrl}${pagePath}`} />
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "kompismoln.se",
      "url": "siteUrl"
    }
  </script>
</svelte:head>
