<script module>
  import { z, ze } from 'compis/schemas';

  export const schema = ze.content({
    test: z.string(),
    body: ze.markdown()
  });
</script>

<script>
  let { test } = $props();
</script>

<h1>{test}</h1>
