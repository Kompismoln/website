import composably from 'composably/vite';
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
  },
  plugins: [composably(config.composably), tailwindcss() ]
});
