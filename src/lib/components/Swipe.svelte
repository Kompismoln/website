<script>
  import Card from '$lib/components/Card.svelte';
  import Intro from '$lib/components/Intro.svelte';
  import { register } from 'swiper/element/bundle';
  import { onMount } from 'svelte';

  register();
  let { content } = $props();

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
    <Intro {content} />
    <div class="mx-auto mt-12 max-w-[1064px]">
      <swiper-container
        navigation="true"
        centered-slides="true"
        effect="coverflow"
        coverflow-effect-slide-shadows="false"
        init="false"
      >
        {#each content.list as item}
          <swiper-slide class="flex items-center justify-center">
            <Card content={item} />
          </swiper-slide>
        {/each}
      </swiper-container>
    </div>
  </div>
</div>
