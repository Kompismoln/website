<script module>
  import { z, ze } from 'compis/schemas';
  import s from '$lib/components/schemas';

  export const schema = ze.content({
    name: z.string(),
    bio: ze.markdown(),
    image: s.image()
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
  <span class="text-accent text-sm">{@html bio.html}</span>
</div>
