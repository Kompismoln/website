<script module>
  import { z, ze } from 'compis/schemas';
  import s from '$lib/components/schemas';

  export const schema = ze.content({
    logo: s.image(),
    license: z.string(),
    socials: z.array(s.social()).max(7)
  });
</script>

<script lang="ts">
  let { logo, license, socials } = $props();
</script>

<footer
  class="footer sm:footer-horizontal bg-neutral text-neutral-content items-center px-12 py-4"
>
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
  <nav
    class="grid-flow-col gap-4 text-2xl md:place-self-center md:justify-self-end"
  >
    {#each socials as social}
      <a href={social.src} aria-label={social.platform}>
        <i class="fa-brands fa-{social.platform}"></i>
      </a>
    {/each}
  </nav>
</footer>
