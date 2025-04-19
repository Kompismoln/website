import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess(),
  kit: {
    alias: {
      compis: 'compis' // /compis is a budding module
    },
    adapter: adapter()
  }
};

export default config;
