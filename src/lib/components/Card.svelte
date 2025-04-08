<script module>
  import z from 'zod';
  import ze from '$lib/zod-extensions';

  export const schema = z.object({
    title: z.string(),
    description: z.string(),
    image: ze.image,
    link: ze.link.optional()
  });
</script>

<script>
  const { title, description, image, link } = $props();
</script>

<div class="card bg-base-200 min-h-[300px] w-[270px]">
  <div class="card-body items-center p-[24px] pt-[32px] text-center">
    <div>
      <img class="h-20 w-20 flex-none object-contain" src={image.src} alt={image.alt} />
    </div>
    <h2 class="card-title">
      {title}
    </h2>
    <p class="pb-12">
      {description}
    </p>
    {#if link}
      <a href={link.url} class="pb-12" target={link.blank ? '_blank' : ''}>
        <button class="btn btn-outline btn-primary min-w-[100px]">{link.text}</button>
      </a>
    {/if}
  </div>
</div>
