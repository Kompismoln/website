import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess(),
  kit: {
    alias: {
      composably: '../composably/src/lib'
    },
    adapter: adapter()
  }
};

export default config;
