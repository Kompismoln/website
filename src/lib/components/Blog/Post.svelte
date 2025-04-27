<script module>
  import { c } from 'compis/schemas';

  export const schema = c.content({
    title: c.string(),
    h1: c.string().optional(),
    body: c.markdown(),
    date: c.date(),
    dateString: c.string().optional(),
    author: c.component(['Author']),
    slots: c.slots().optional()
  });
</script>

<script lang="ts">
  import { mountSlots } from 'compis/hooks';

  let { title, h1, date, dateString, body, author, slots } = $props();

  mountSlots(slots);

  dateString = dateString ?? date.toISOString().slice(0, 10);
</script>

<div class="container mx-auto px-4 pb-8">
  <article class="prose lg:prose-xl mx-auto">
    <header class="mb-8">
      <h1 class="text-primary text-4xl font-bold">{h1 || title}</h1>
      <p class="text-accent text-sm">
        <time datetime={date}>{dateString}</time>
      </p>
    </header>

    <section class="space-y-6">
      {@render body.snippet({ author })}
    </section>

    <section class="mt-8 flex items-center border-t pt-6">
      <author.component {...author.props} />
    </section>
  </article>
</div>

<style lang="postcss">
  @reference "tailwindcss";
  :global em {
    color: var(--color-secondary);
  }
  :global pre {
    background-color: oklch(14.731% 0.02 264.094);
  }
  :global .checkbox {
    margin-right: 0.5em;
  }
  :global .contains-task-list {
    @apply list-none text-left;
    text-align: left;
    li {
      @apply py-1 pl-6 -indent-9;
    }
  }
  :global .alert {
    @reference "tailwindcss";
    @apply my-2 md:my-12;
  }
  :global ul {
  }
</style>
