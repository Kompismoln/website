<script lang="ts">
  let { src, blank, image } = $props();
</script>

<div class="hidden md:block">
  <a href={src} target={blank ? '_blank' : ''} class="link">
    <div class="mockup-browser border">
      <div class="mockup-browser-toolbar">
        <div class="input" style="background:#eee;">{src}</div>
      </div>
      <div class="flex justify-center">
        <img alt={image.alt} class="aspect-2044/1242" src={image.src} />
      </div>
    </div>
  </a>
</div>
<div class="md:hidden">
  <a href={src} target="_blank" class="link">
    <div class="card overflow-hidden border shadow-xl">
      <img alt={image.alt} class="aspect-2044/1242" src={image.src} />
    </div>
  </a>
</div>
