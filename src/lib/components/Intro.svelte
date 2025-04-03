<script lang="ts">
  import { marked } from 'marked';
  let { content } = $props();
</script>

<div class="mx-auto max-w-lg text-center">
  <div class="markdown-content">
    {@html marked(content.body)}
  </div>
</div>

<style lang="postcss">
  .markdown-content :global h1 {
    @reference "tailwindcss";
    @apply pb-2 text-3xl font-bold md:text-5xl;
  }
  .markdown-content :global h1 em {
    @reference "tailwindcss";
    @apply underline decoration-4 md:decoration-[6px];
    text-decoration-color: var(--color-secondary);
    font-style: normal;
  }
  .markdown-content :global p {
    @reference "tailwindcss";
    @apply mt-6 text-sm font-bold md:mt-10 md:text-lg;
  }

  .markdown-content :global p em {
    @reference "tailwindcss";
    @apply underline decoration-[3px] md:decoration-[4px];
    text-decoration-color: var(--color-secondary);
    font-style: normal;
  }
  :global swiper-slide:not(.swiper-slide-active) a {
    pointer-events: none;
  }
</style>
