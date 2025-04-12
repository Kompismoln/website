import Inspect from 'vite-plugin-inspect';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      allow: ['compis']
    }
  },
  plugins: [Inspect(), tailwindcss(), sveltekit()]
});
