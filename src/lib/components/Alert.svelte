<script module>
  import { c } from 'composably/schemas';

  export const schema = c.content({
    theme: c.string().optional(),
    icon: c.string(),
    text: c.markdown()
  });
</script>

<script lang="ts">
  const { theme, icon, text } = $props();
</script>

<div role="alert" class="not-prose alert {theme}">
  <i class="fa-solid text-3xl {icon}"></i>
  <span>{@html text.html}</span>
</div>
