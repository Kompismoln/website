<script module>
  import { c } from 'composably/schemas';

  export const schema = c.content({
    title: c.string().optional(),
    test: c.string(),
    body: c.markdown(),
    slots: c.slots()
  });
</script>

<script>
  let { test, body } = $props();
</script>

<h1>{test}</h1>
<body.component {...body} />
