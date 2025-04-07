<script lang="ts">
  import { marked } from 'marked';
  const { body } = $props();
</script>

<div class="mt-6 min-w-[270px] lg:mt-0 lg:min-w-[420px]">
  <div class="my-auto">
    <div class="px-4">
      <div class="markdown-content">
        {marked(body)}
        <p>
          SaaS Starter was created by <span class="font-bold whitespace-nowrap">
            Critical Moments
          </span>: a SDK to to help mobile apps
          <span class="decoration-secondary underline decoration-[3px]">
            increase conversion rates and app-ratings.
          </span>
        </p>
      </div>
      <div class="mt-6 px-4 text-lg md:text-xl">
        Our <a href="https://criticalmoments.io" class="link font-bold" target="_blank">webpage</a> is
        the best example of SaaS Starter with style and real content.
      </div>
      <div class="text-large mt-4">
        <a href="https://criticalmoments.io" target="_blank">
          <button class="btn btn-primary btn-wide mt-3">See it in Action</button>
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
</style>
