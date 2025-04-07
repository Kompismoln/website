<script module>
  import z from 'zod';
  export const schema = z.object({
    logo: z.object({
      src: z.string(),
      alt: z.string()
    }),
    license: z.string(),
    socials: z
      .array(
        z.object({
          src: z.string(),
          platform: z.string()
        })
      )
      .max(7)
  });
</script>

<script lang="ts">
  let { logo, license, socials } = $props();
</script>

<footer class="footer sm:footer-horizontal bg-neutral text-neutral-content items-center px-12 py-4">
  <aside class="grid-flow-col items-center">
    <div class="chat chat-start">
      <div class="chat-image">
        <div class="w-20">
          <img class="object-contain" src={logo.src} alt={logo.alt} />
        </div>
      </div>
      <div class="chat-bubble max-w-96">{license}</div>
    </div>
  </aside>
  <nav class="grid-flow-col gap-4 text-2xl md:place-self-center md:justify-self-end">
    {#each socials as social}
      <a href={social.src} aria-label={social.platform}>
        <i class="fa-brands fa-{social.platform}"></i>
      </a>
    {/each}
  </nav>
</footer>
