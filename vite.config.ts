import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: true
  },
  plugins: [tailwindcss(), sveltekit()]
});
