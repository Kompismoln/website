import composably from './composably/src/lib/vite';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

const composablyOptions = {
  componentRoot: path.resolve(__dirname, 'src/lib/components/'),
  contentRoot: path.resolve(__dirname, 'src/lib/content/'),
  indexFile: 'index',
};

export default defineConfig({
  server: {
    watch: {
      ignored: ['**/.direnv/**']
    },
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      allow: ['composably']
    }
  },
  plugins: [composably(composablyOptions), tailwindcss(), sveltekit()]
});
