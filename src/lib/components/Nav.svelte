<script module>
  import z from 'zod';
  import ze from '$lib/ssg/schemas';

  export const schema = z.object({
    logo: ze.image,
    searchPage: z.union([z.boolean(), z.string()]),
    menu: z.array(ze.link).max(4)
  });
</script>

<script lang="ts">
  let { logo, searchPage, menu } = $props();
</script>

<div class="navbar bg-neutral text-neutral-content px-6">
  <div class="navbar-start">
    <img class="h-20 w-20 flex-none object-contain" src={logo.src} alt={logo.alt} />
  </div>
  <div class="navbar-center">
    <label class="flex cursor-pointer gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
      <input type="checkbox" value="light" class="toggle theme-controller" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <path
          d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
        />
      </svg>
    </label>
  </div>
  <div class="navbar-end">
    <ul class="menu menu-horizontal hidden text-lg font-bold sm:flex">
      {#each menu as item}
        <li class="md:mx-2"><a href={item.url}>{item.text}</a></li>
      {/each}
      {#if searchPage}
        <li class="md:mx-0">
          <a href={searchPage} aria-label="Search">
            <svg class="h-6 w-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
              ><path
                d="M17.545 15.467l-3.779-3.779a6.15 6.15 0 0 0 .898-3.21c0-3.417-2.961-6.377-6.378-6.377A6.185 6.185 0 0 0 2.1 8.287c0 3.416 2.961 6.377 6.377 6.377a6.15 6.15 0 0 0 3.115-.844l3.799 3.801a.953.953 0 0 0 1.346 0l.943-.943c.371-.371.236-.84-.135-1.211zM4.004 8.287a4.282 4.282 0 0 1 4.282-4.283c2.366 0 4.474 2.107 4.474 4.474a4.284 4.284 0 0 1-4.283 4.283c-2.366-.001-4.473-2.109-4.473-4.474z"
                fill="currentColor"
              /></svg
            >
          </a>
        </li>
      {/if}
    </ul>
    <div class="dropdown dropdown-end sm:hidden">
      <!-- svelte-ignore a11y_label_has_associated_control -->
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <label tabindex="0" class="btn btn-ghost btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h7"
          /></svg
        >
      </label>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <ul
        tabindex="0"
        class="menu menu-lg dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 font-bold shadow-sm"
      >
        {#each menu as item}
          <li class="md:mx-2"><a href={item.url}>{item.text}</a></li>
        {/each}
      </ul>
    </div>
  </div>
</div>
