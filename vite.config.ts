import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { composably } from 'composably/vite';
import config from './src/lib/config';

export default defineConfig({
  server: {
    watch: {
      ignored: ['**/.direnv/**']
    },
    host: '0.0.0.0',
    allowedHosts: true
  },
  plugins: [sveltekit(), tailwindcss(), composably(config.composably)]
});
