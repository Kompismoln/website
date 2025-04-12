<script module>
  import { z, ze } from 'compis/schemas';

  export const schema = ze.content({
    color: z.string(),
    icon: z.string(),
    text: ze.markdown()
  });
</script>

<script>
  const { color, icon, text } = $props();
</script>

<div role="alert" class="alert alert-{color}">
  <i class="fa-solid text-3xl {icon}"></i>
  <span>{@html text.html}</span>
</div>
