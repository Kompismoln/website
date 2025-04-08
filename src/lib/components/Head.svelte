<script module>
  import z from 'zod';

  export const schema = z.object({
    siteName: z.string(),
    pageName: z.string().optional(),
    pagePath: z.string(),
    siteUrl: z.string(),
    siteDescription: z.string()
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
