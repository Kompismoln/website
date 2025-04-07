<script module>
  import z from 'zod';
  import { z_component } from '$lib/ssg/schemas';

  export const schema = z.object({
    intro: z_component('Blurb'),
    slides: z.array(z_component('Card'))
  });
</script>

<script>
  import { register } from 'swiper/element/bundle';
  import { onMount } from 'svelte';
  import { resolveComponent } from '$lib/ssg/component.loader';

  let { intro, slides } = $props();

  const Intro = resolveComponent(intro);

  register();
  onMount(() => {
    const swiperEl = document.querySelector('swiper-container');
    const swiperParams = {
      slidesPerView: 1,
      breakpoints: {
        768: {
          slidesPerView: 3
        }
      },
      on: {
        init() {}
      }
    };

    if (swiperEl) {
      Object.assign(swiperEl, swiperParams);
      swiperEl.initialize();
    }
  });
</script>

<div class="min-h-[60vh]">
  <div class="pt-20 pb-8 md:px-7">
    <Intro.component {...Intro.props} />
    <div class="mx-auto mt-12 max-w-[1064px]">
      <swiper-container
        navigation="true"
        centered-slides="true"
        effect="coverflow"
        coverflow-effect-slide-shadows="false"
        init="false"
      >
        {#each slides as slide}
          {@const Slide = resolveComponent(slide)}
          <swiper-slide class="flex items-center justify-center">
            <Slide.component {...Slide.props} />
          </swiper-slide>
        {/each}
      </swiper-container>
    </div>
  </div>
</div>
