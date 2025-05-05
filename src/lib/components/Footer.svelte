<script module>
  import { c } from 'composably/schemas';

  export const schema = c.content({
    logo: c.image(),
    license: c.string(),
    socials: c.array(c.social()).max(7)
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
    {#each socials as social, key (key)}
      <a href={social.src} aria-label={social.platform}>
        <i class="fa-brands fa-{social.platform}"></i>
      </a>
    {/each}
  </nav>
</footer>
