<script module>
  import { z, ze } from 'compis/schemas';
  import s from '$lib/components/schemas';

  export const schema = ze.content({
    title: z.string(),
    description: ze.markdown(),
    image: s.image(),
    link: s.link().optional()
  });
</script>

<script>
  const { title, description, image, link } = $props();
</script>

<div class="card bg-base-200 not-prose">
  <div class="card-body items-center text-center">
    <p class="card-title text-secondary text-2xl">
      {title}
    </p>
    <div class="p-4">
      <img class="h-36" src={image.src} alt={image.alt} />
    </div>
    <p>
      {@html description.html}
    </p>
    {#if link}
      <a href={link.url} target={link.blank ? '_blank' : ''}>
        <button class="btn btn-outline btn-primary min-w-[100px]"
          >{link.text}</button
        >
      </a>
    {/if}
  </div>
</div>
