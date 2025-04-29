<script module>
  import { c } from 'composably/schemas';

  export const schema = c.content({
    body: c.markdown(),
    button: c.button()
  });
</script>

<script lang="ts">
  const { body, button } = $props();
</script>

<div class="mt-6 min-w-[270px] lg:mt-0 lg:min-w-[420px]">
  <div class="my-auto">
    <div class="px-4">
      <div class="markdown-content space-y-6">
        {@html body.html}
      </div>
      <div class="mt-6 px-4 text-lg md:text-xl"></div>
      <div class="text-large mt-4">
        <a href={button.url} target="_blank">
          <button class="btn btn-primary btn-wide mt-3">{button.text}</button>
        </a>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .markdown-content :global p {
    @reference "tailwindcss";
    @apply text-lg md:text-xl;
  }
  .markdown-content :global p strong {
    @reference "tailwindcss";
    @apply font-bold whitespace-nowrap;
  }
  .markdown-content :global p em {
    @reference "tailwindcss";
    @apply underline decoration-[3px];
    font-style: normal;
  }
  .markdown-content :global p a {
    @reference "tailwindcss";
    @apply font-bold;
  }
</style>
