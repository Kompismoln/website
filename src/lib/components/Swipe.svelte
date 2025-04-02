<script>
  import { onMount } from 'svelte';
  import Swiper from 'swiper/bundle';
  import 'swiper/css/bundle';

  let { content } = $props();

  onMount(() => {
    new Swiper('.swiper', {
      effect: 'coverflow',
      slidesPerView: 3,
      centeredSlides: true,
      coverflowEffect: {
        depth: 100,
        stretch: 0
      },
      keyboard: {
        enabled: true,
        onlyInViewport: false
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    });
  });
</script>

<div class="min-h-[60vh]">
  <div class="px-7 pt-20 pb-8">
    <div class="px-48 text-center">
      <h2 class="text-5xl font-bold">{content.title}</h2>
      <p class="my-6">{content.description}</p>
      <div class="swiper">
        <div class="swiper-wrapper">
          {#each content.list as item}
            <div class="swiper-slide">
              <div class="card bg-base-200 min-h-[300px] w-[270px] shadow-xl">
                <div class="card-body items-center p-[24px] pt-[32px] text-center">
                  <div>
                    <svg
                      width="50px"
                      height="50px"
                      class="stroke-primary mt-1 mb-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {@html item.svgContent}
                    </svg>
                  </div>
                  <h2 class="card-title">
                    {item.name}
                  </h2>
                  <p class="pb-12">
                    {item.description}
                  </p>
                  {#if item.link}
                    <a href={item.link} class="pb-12" target={item.newPage ? '_blank' : ''}>
                      <button class="btn btn-outline btn-primary min-w-[100px]"
                        >{item.linkText ? item.linkText : 'Try It'}</button
                      >
                    </a>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    </div>
  </div>
</div>
