import type { Plugin } from 'vite';
import { discoverContentPaths, loadContent } from './content.loader';

export default async function composably(
  options: Record<string, string>
): Promise<Plugin> {
  return {
    name: 'svelte-composably',

    async load(id) {
      if (id === 'virtual:content') {
        const entries = discoverContentPaths();
        const tpl = (p: string) =>
          `'${p}': () => import('virtual:content/${p}')`;
        const code = `export default { ${entries.map(tpl).join(',\n')} }; `;
        return code;
      }

      if (id.startsWith('virtual:content/')) {
        const path = id.slice('virtual:content/'.length);
        const page = await loadContent(path);

        let code = `export default async () => (${JSON.stringify(page)});`;

        code = code.replace(
          /"component":"([^"]+)"/g,
          (_, path) =>
            `"component":(await import('${options.componentRoot}/${path}.svelte')).default`
        );

        return code;
      }
    },

    resolveId(source) {
      if (source.startsWith('virtual:content')) {
        return source;
      }
    }
  };
}
