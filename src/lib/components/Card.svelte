<script>
  let { name, description, svgContent, newPage, link, linkText } = $props();
</script>

<div class="card bg-base-200 min-h-[300px] w-[270px]">
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
        {@html svgContent}
      </svg>
    </div>
    <h2 class="card-title">
      {name}
    </h2>
    <p class="pb-12">
      {description}
    </p>
    {#if link}
      <a href={link} class="pb-12" target={newPage ? '_blank' : ''}>
        <button class="btn btn-outline btn-primary min-w-[100px]"
          >{linkText ? linkText : 'Try It'}</button
        >
      </a>
    {/if}
  </div>
</div>
