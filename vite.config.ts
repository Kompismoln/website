import composably from './compis/vite';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const composablyOptions = {
  componentRoot: '/src/lib/components/'
};

export default defineConfig({
  server: {
    watch: {
      ignored: ['**/.direnv/**']
    },
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      allow: ['compis']
    }
  },
  plugins: [composably(composablyOptions), tailwindcss(), sveltekit()]
});
