<script lang="ts">
  import { marked } from 'marked';
  let { content } = $props();
</script>

<div class="hero min-h-[60vh]">
  <div class="hero-content py-12 text-center">
    <div class="max-w-xl">
      <div class="text-secondary mb-3 pb-1 text-xl font-bold md:mb-7 md:text-3xl">
        {content.primer}
      </div>

      <div class="markdown-content">
        {@html marked(content.body)}
      </div>
      {#if content.buttons}
        <div class="mt-6 flex flex-row flex-wrap place-content-center gap-4 md:mt-4">
          {#each content.buttons as button}
            <a href={button.url}>
              <button class:btn-outline={!button.primary} class="btn btn-primary"
                >{button.text}</button
              >
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>

<style lang="postcss">
  .markdown-content :global h1 {
    @reference "tailwindcss";
    @apply px-2 text-4xl font-bold md:text-6xl;
    line-height: 1.2;
  }
  .markdown-content :global h1 em {
    @reference "tailwindcss";
    @apply underline decoration-4 md:decoration-[6px];
    text-decoration-color: var(--color-secondary);
    font-style: normal;
  }
  .markdown-content :global p {
    @reference "tailwindcss";
    @apply mt-6 text-sm md:mt-10 md:text-lg;
  }
</style>
