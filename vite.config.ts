import Inspect from 'vite-plugin-inspect';
import tailwindcss from '@tailwindcss/vite';
import composably from './compis/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      allow: ['compis']
    }
  },
  plugins: [
    tailwindcss(),
    sveltekit(),
    composably(),
  ]
});
