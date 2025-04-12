<script module>
  import { ze } from 'compis/schemas';
  import s from '$lib/components/schemas';

  export const schema = ze.content({
    link: s.link(),
    image: s.image()
  });
</script>

<script lang="ts">
  let { link, image } = $props();
</script>

<div class="hidden md:block">
  <a href={link.url} target={link.blank ? '_blank' : ''} class="link">
    <div class="mockup-browser border">
      <div class="mockup-browser-toolbar">
        <div class="input" style="background:#eee;">{link.url}</div>
      </div>
      <div class="flex justify-center">
        <img alt={image.alt} class="aspect-2044/1242" src={image.src} />
      </div>
    </div>
  </a>
</div>
<div class="md:hidden">
  <a href={link.url} target="_blank" class="link">
    <div class="card overflow-hidden border shadow-xl">
      <img alt={image.alt} class="aspect-2044/1242" src={image.src} />
    </div>
  </a>
</div>
