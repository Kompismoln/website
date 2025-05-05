<script module>
  import { c } from 'composably/schemas';

  export const schema = c.content({
    name: c.string(),
    bio: c.markdown(),
    image: c.image()
  });
</script>

<script lang="ts">
  let { name, bio, image } = $props();
</script>

<div class="flex-shrink-0">
  <img src={image.src} alt={image.alt} class="h-12 w-12 rounded-full" />
</div>
<div class="ml-4">
  <p class="text-primary font-semibold">{name}</p>
  <span class="text-accent text-sm"><bio.component {...bio} /></span>
</div>
