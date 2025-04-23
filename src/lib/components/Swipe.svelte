<script module>
  import { z, ze } from 'compis/schemas';

  export const schema = ze.content({
    intro: ze.component(['Blurb']).optional(),
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

<div>
  {#if intro}
    <intro.component {...intro.props} />
  {/if}
  <div>
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
