<script module>
  import { z, ze } from '../..//schemas';

  export const schema = ze.content({
    theme: z.string(),
    icon: z.string(),
    text: ze.markdown()
  });
</script>

<script lang="ts">
  const { theme, icon, text } = $props();
</script>

<h1>asdf</h1>
