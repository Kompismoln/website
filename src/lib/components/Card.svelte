<script module>
  import { z, ze } from 'compis/schemas';
  import s from '$lib/components/schemas';

  export const schema = ze.content({
    title: z.string(),
    description: z.string(),
    image: s.image(),
    link: s.link().optional()
  });
</script>

<script>
  const { title, description, image, link } = $props();
</script>

<div class="card bg-base-200 min-h-[300px] w-[270px]">
  <div class="card-body items-center p-[24px] pt-[32px] text-center">
    <div>
      <img
        class="h-20 w-20 flex-none object-contain"
        src={image.src}
        alt={image.alt}
      />
    </div>
    <p class="card-title">
      {title}
    </p>
    <p class="pb-12">
      {description}
    </p>
    {#if link}
      <a href={link.url} class="pb-12" target={link.blank ? '_blank' : ''}>
        <button class="btn btn-outline btn-primary min-w-[100px]"
          >{link.text}</button
        >
      </a>
    {/if}
  </div>
</div>
