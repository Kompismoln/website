import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['composably/**/*.{test,spec}.{js,ts}'],
    deps: { optimizer: { web: { include: ['@sveltejs/kit'] } } }
  },
  typecheck: {
    tsconfig: 'composably/test/tsconfig.test.json'
  }
});
