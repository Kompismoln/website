<script module>
  import { z, ze } from 'compis/schemas';

  export const schema = ze.content({
    theme: z.string(),
    icon: z.string(),
    text: ze.markdown()
  });
</script>

<script lang="ts">
  const { theme, icon, text } = $props();
</script>

<div role="alert" class="alert {theme}">
  <i class="fa-solid text-3xl {icon}"></i>
  <span>{@html text.html}</span>
</div>
