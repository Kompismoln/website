import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'node:path';
import ssgConfig from './src/lib/ssg/config';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: true
  },
  plugins: [tailwindcss(), sveltekit()],
  resolve: {
    alias: {
      $components: path.resolve(__dirname, `./${ssgConfig.componentRoot}`)
    }
  }
});
