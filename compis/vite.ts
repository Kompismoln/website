import type { Plugin } from 'vite';
import { discoverContentPaths, loadContent } from './content.loader';

export default async function composably(
  options: Record<string, string>
): Promise<Plugin> {
  return {
    name: 'svelte-composably',
    enforce: 'pre',

    async load(id) {
      if (id === 'composably:content') {
        const entries = discoverContentPaths();
        const tpl = (p: string) =>
          `'${p}': () => import('composably:content/${p}')`;
        const code = `export default { ${entries.map(tpl).join(',\n')} }; `;
        return code;
      }

      if (id.startsWith('composably:content/')) {
        const path = id.slice('composably:content/'.length);
        const page = await loadContent(path);

        let code = `export default async () => (${JSON.stringify(page)});`;

        code = code.replace(
          /"component":"([^"]+)"/g,
          (_, path) => {
            const virt = path.startsWith('composably:component');
            const imp = virt ? path : `${options.componentRoot}/${path}`;
            return `"component":(await import('${imp}.svelte')).default`
          }
        );
        return code;
      }

      if (id.startsWith('composably:component')) {
        const path = id.slice('composably:component/'.length, -'.svelte'.length);
        return `<h1>${path}</h1>`;
      }

    },

    resolveId(source) {
      if (source.startsWith('composably:')) {
        return source;
      }
    }
  };
}
