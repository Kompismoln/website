<script module>
  import z from 'zod';
  import ze from '$lib/zod-extensions';

  export const schema = z.object({
    name: z.string(),
    bio: z.string(),
    image: ze.image,
  });
</script>

<script lang="ts">
  import { marked } from 'marked';
  let { name, bio, image } = $props();
</script>

<div class="flex-shrink-0">
  <img
    src="{image.src}"
    alt="{image.alt}"
    class="h-12 w-12 rounded-full"
  />
</div>
<div class="ml-4">
  <p class="text-primary dark:text-primary-dark font-semibold">{name}</p>
  <span class="text-accent dark:text-accent-dark text-sm">{@html marked(bio)}</span>
</div>
