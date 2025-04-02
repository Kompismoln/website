<script lang="ts">
  import { WebsiteName, WebsiteBaseUrl, WebsiteDescription } from '$lib/config';
  const ldJson = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: WebsiteName,
    url: WebsiteBaseUrl
  };
  const jsonldScript = `<script type="application/ld+json">${JSON.stringify(ldJson) + '<'}/script>`;
</script>

<svelte:head>
  <title>{WebsiteName}</title>
  <meta name="description" content={WebsiteDescription} />
  {@html jsonldScript}
</svelte:head>
