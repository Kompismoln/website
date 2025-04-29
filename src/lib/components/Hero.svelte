<script module>
  import { c } from 'composably/schemas';

  export const schema = c.content({
    primer: c.string(),
    body: c.markdown({
      decreaseHeadings: false
    }),
    buttons: c.array(c.button()).max(2)
  });
</script>

<script lang="ts">
  let { primer, body, buttons } = $props();
  let animations = [
    'animate__backInDown',
    'animate__shakeX',
    'animate__shakeY',
    'animate__zoomInDown',
    'animate__rollIn',
    'animate__lightSpeedInRight',
    'animate__tada',
    'animate__wobble',
    'animate__swing',
    'animate__hinge',
    'animate__backOutUp'
  ];

  let current = 0;
  let anim = $state(animations[current]);

  function trigger(event: Event) {
    const el = event.target as Element;
    if (!el) {
      return;
    }

    el.classList.remove(anim);
    current = (current + 1) % animations.length;
    anim = animations[current];
    el.classList.add(anim);
  }
</script>

<div class="hero">
  <div class="hero-content text-center">
    <div class="max-w-3xl space-y-6">
      <div
        class="
        text-secondary
        animate__animated
        py-6
        {anim}
        text-base
        font-bold
        md:text-2xl
        "
        role="button"
        tabindex="-1"
        onkeyup={trigger}
        onclick={trigger}
      >
        {primer}
      </div>

      <div class="markdown-content space-y-6">
        <body.component {...body} />
      </div>
      {#if buttons}
        <div class="flex flex-row flex-wrap place-content-center gap-4">
          {#each buttons as button}
            <a href={button.url}>
              <button class:btn-outline={!button.fill} class="btn btn-primary">
                {button.text}
              </button>
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>

<style lang="postcss">
  .markdown-content :global h1 em {
    @reference "tailwindcss";
    @apply underline decoration-4 md:decoration-[6px];
    text-decoration-color: var(--color-secondary);
    font-style: normal;
  }
  .markdown-content :global p {
    @reference "tailwindcss";
    @apply text-base md:text-lg;
  }
</style>
