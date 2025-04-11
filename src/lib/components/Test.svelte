<script module>
  import z from 'zod';
  import ze from '$lib/zod-extensions';

  export const schema = z.object({
    title: z.string(),
    body: z.string(),
    testComponent: ze.component('Author2', 'Preview')
  });
</script>

<script>
  import { marked } from 'marked';
  import { resolveComponent } from '$lib/ssg/component.loader';
  let { title, body, testComponent } = $props();
  const TC = resolveComponent(testComponent);
</script>

<h1>{title}</h1>
{@html marked(body)}
<TC.component {...TC.props} />
