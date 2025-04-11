<script module>
  import z from 'zod';
  import ze from '$lib/zod-extensions';

  export const schema = z.object({
    title: z.string(),
    h1: z.string().optional(),
    body: z.string(),
    date: z.date(),
    dateString: z.string().optional(),
    author: ze.component('Author')
  });
</script>

<script lang="ts">
  import { resolveComponent } from '$lib/ssg/component.loader';
  import { createMarked } from '$lib/marked';

  let { title, h1, date, dateString, body, author } = $props();

  const { md, renderer } = createMarked();
  renderer.image = function ({ href, title, text }) {
    return `
  <div class="my-6">
  <img src="${href}" alt="${text}" title="${title}" class="w-full rounded-lg shadow-lg">
  </div>`;
  };
  md.use({ renderer });

  const Author = resolveComponent(author);

  dateString = dateString ?? date.toISOString().slice(0, 10);
</script>

<div class="container mx-auto px-4 py-8">
  <article class="prose lg:prose-xl mx-auto">
    <header class="mb-8">
      <h1 class="text-primary dark:text-primary-dark text-4xl font-bold">{h1 || title}</h1>
      <p class="text-accent dark:text-accent-dark text-sm">
        Skriven <time datetime={date}>{dateString}</time>
      </p>
    </header>

    <section class="space-y-6">
      {@html md.parse(body)}
    </section>

    <section class="mt-8 flex items-center border-t pt-6">
      <Author.component {...Author.props} />
    </section>
  </article>
</div>
