import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    deps: { optimizer: { web: { include: ['@sveltejs/kit'] } } }
  },
  typecheck: {
    tsconfig: 'src/test/tsconfig.test.json'
  }
});
