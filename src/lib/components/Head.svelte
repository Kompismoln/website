<script lang="ts">
  let { siteName, siteUrl, siteDescription } = $props();
  const ldJson = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl
  };
  const jsonldScript = `<script type="application/ld+json">${JSON.stringify(ldJson) + '<'}/script>`;
</script>

<svelte:head>
  <title>{siteName}</title>
  <meta name="description" content={siteDescription} />
  {@html jsonldScript}
</svelte:head>
