import type { Plugin } from 'vite';
import { discoverContentPaths, loadContent, findVirtualComponents } from './content.loader';
import type { PageContent, ComponentContent } from './types';

let entries: string[];
const getEntries = (refresh = false) => {
  if (refresh || !entries) {
    entries = discoverContentPaths();
  }
  return entries;
}

let content: Record<string, Promise<PageContent>>;
const getContent = (refresh = false) => {
  if (refresh || !content) {
    entries = discoverContentPaths();
    content = Object.fromEntries(getEntries().map((p) => [p, loadContent(p)]));
  }
  return content;
}

let virtualComponents: Record<string, ComponentContent> = {};

export default async function composably(
  options: Record<string, string>
): Promise<Plugin> {
  return {
    name: 'svelte-composably',
    enforce: 'pre',

    async buildStart() {


      for (const p of getEntries()) {
        const comps = await findVirtualComponents(await getContent()[p]);
        Object.assign(virtualComponents, comps);
      }
    },

    async load(id) {
      if (id === 'composably:content') {
        const tpl = (p: string) =>
          `'${p}': () => import('composably:content/${p}')`;
        const code = `export default { ${getEntries().map(tpl).join(',\n')} }; `;
        return code;
      }

      if (id.startsWith('composably:content/')) {
        const path = id.slice('composably:content/'.length);
        const page = await getContent()[path];

        let code = `export default async () => (${JSON.stringify(page)});`;

        code = code.replace(/"component":"([^"]+)"/g, (_, path) => {
          const virt = path.startsWith('composably:component');
          const imp = virt ? path : `${options.componentRoot}/${path}`;
          return `"component":(await import('${imp}.svelte')).default`;
        });
        return code;
      }

      if (id.startsWith('composably:component')) {
        const path = id.slice(0, -'.svelte'.length);
        const content = virtualComponents[path];
        const { component, ...props } = content;
        const propString = `{ ${Object.keys(props).join(', ')} }`;
        const scriptString = `<script>\n  let ${propString} = $props();\n</script>`;

        return 'asdf';
        return `${scriptString}${content.body}`;
      }
    },

    resolveId(source) {
      if (source.startsWith('composably:')) {
        return source;
      }
    }
  };
}
