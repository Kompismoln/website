<script module>
  import { z, ze } from 'compis/schemas';

  export const schema = ze.content({
    title: z.string(),
    h1: z.string().optional(),
    body: ze.markdown(),
    date: z.date(),
    dateString: z.string().optional(),
    author: ze.component(['Author']),
    slots: ze.slots().optional()
  });
</script>

<script lang="ts">
  import { mountSlots } from 'compis/hooks';

  let { title, h1, date, dateString, body, author, slots } = $props();

  mountSlots(slots);

  dateString = dateString ?? date.toISOString().slice(0, 10);
</script>

<div class="container mx-auto px-4 pt-24 pb-8">
  <article class="prose lg:prose-xl mx-auto">
    <header class="mb-8">
      <h1 class="text-primary text-4xl font-bold">{h1 || title}</h1>
      <p class="text-accent text-sm">
        Skriven <time datetime={date}>{dateString}</time>
      </p>
    </header>

    <section class="space-y-6">
      {@html body.html}
    </section>

    <section class="mt-8 flex items-center border-t pt-6">
      <author.component {...author.props} />
    </section>
  </article>
</div>
