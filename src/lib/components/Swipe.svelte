<script module>
  import { z, ze } from 'compis/schemas';

  export const schema = ze.content({
    intro: ze.component(['Blurb']),
    slides: z.array(ze.component(['Card']))
  });
</script>

<script lang="ts">
  import { register } from 'swiper/element/bundle';
  import { onMount } from 'svelte';

  let { intro, slides } = $props();

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
    <intro.component {...intro.props} />
    <div class="mx-auto mt-12 max-w-[1064px]">
      <swiper-container
        navigation="true"
        centered-slides="true"
        effect="coverflow"
        coverflow-effect-slide-shadows="false"
        init="false"
      >
        {#each slides as slide}
          <swiper-slide class="flex items-center justify-center">
            <slide.component {...slide.props} />
          </swiper-slide>
        {/each}
      </swiper-container>
    </div>
  </div>
</div>
