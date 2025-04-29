<script module>
  import { c } from 'composably/schemas';

  export const schema = c.content({
    test: c.string(),
    body: c.markdown()
  });
</script>

<script>
  let { test, body } = $props();
</script>

<h1>{test}</h1>
<body.component {...body} />
