<script module>
  import { c } from '../..//schemas';

  export const schema = c.content({
    theme: c.string(),
    icon: c.string(),
    text: c.markdown()
  });
</script>

<script lang="ts">
  const { theme, icon, text } = $props();
</script>

<h1>asdf</h1>
