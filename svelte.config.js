import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import compis from './compis.config.js';

const config = {
  preprocess: vitePreprocess(),
  kit: {
    alias: {
      $components: compis.componentRoot,
      compis: 'compis' // /compis is a budding module
    },
    adapter: adapter()
  }
};

export default config;
