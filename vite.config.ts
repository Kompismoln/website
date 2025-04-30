import composably from '../composably/src/lib/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import config from './src/lib/config';

export default defineConfig({
  server: {
    watch: {
      ignored: ['**/.direnv/**']
    },
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      allow: ['../composably']
    }
  },
  plugins: [composably(config.composably), tailwindcss() ]
});
