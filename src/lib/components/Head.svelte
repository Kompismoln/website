<script lang="ts">
  let { content } = $props();
  const ldJson = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: content.siteName,
    url: content.siteUrl
  };
  const jsonldScript = `<script type="application/ld+json">${JSON.stringify(ldJson) + '<'}/script>`;
</script>

<svelte:head>
  <title>{content.siteName}</title>
  <meta name="description" content={content.siteDescription} />
  {@html jsonldScript}
</svelte:head>
