<script lang="ts">
  import { browser } from '$app/environment';

  let { themes } = $props();

  let currentTheme: string = $state(themes[0]);

  if (browser) {
    currentTheme = localStorage.getItem('theme') || themes[0];
  }

  const toggleTheme = () => {
    currentTheme = currentTheme === themes[0] ? themes[1] : themes[0];
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
  };
</script>

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
  <input
    type="checkbox"
    value={themes[1]}
    onchange={toggleTheme}
    checked={currentTheme === themes[1]}
    class="toggle theme-controller"
  />
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
