<script lang="ts">
  let { content } = $props();
</script>

<footer class="footer sm:footer-horizontal bg-neutral text-neutral-content items-center px-12 py-4">
  <aside class="grid-flow-col items-center">
    <div class="chat chat-start">
      <div class="chat-image">
        <div class="w-20">
          <img class="object-contain" src={content.logo.src} alt={content.logo.alt} />
        </div>
      </div>
      <div class="chat-bubble max-w-96">{content.license}</div>
    </div>
  </aside>
  <nav class="grid-flow-col gap-4 text-2xl md:place-self-center md:justify-self-end">
    {#each content.socials as social}
      <a href={social.src} aria-label={social.platform}>
        <i class="fa-brands fa-{social.platform}"></i>
      </a>
    {/each}
  </nav>
</footer>
