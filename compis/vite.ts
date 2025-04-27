import { discoverContentPaths, collectPage } from './content.loader';
import type { Plugin } from 'vite';
import type { ComponentContent } from './types';
import { appendFileSync } from 'node:fs';
import { resolve } from 'node:path';


const logPath = resolve('.transform-log.txt');
const logFormat = (message: string) => `[${new Date().toISOString()}] ${message}\n`;
const log = (message: string) => appendFileSync(logPath, logFormat(message));
const componentRoot = '/src/lib/components';


const loadContent = async (path:string) => {
  let page = await collectPage(path);
  /*
  page = await contentTraverser({
    obj: page,
    filter: (obj) => 'component' in obj,
    callback: conformComponent
  });
  */
  return page;
}

export const conformComponent = async (
  content: ComponentContent
): Promise<ComponentContent> => {
  return content;
};

export default async function composably(): Promise<Plugin>{

  return {
    name: 'svelte-composably',

    async load(id) {
      if (id === 'virtual:content') {
        const entries = discoverContentPaths();
        const code = `
          export default {
            ${entries.map(p => `'${p}': () => import('virtual:content/${p}')`).join(',\n')}
          };
        `;
        return code;

      };

      if (id.startsWith('virtual:content/')) {
        const path = id.slice('virtual:content/'.length);
        const page = await loadContent(path);

        let code = `
          export default ${JSON.stringify(page)};
        `;
        code = code.replace(/"component":"([^"]+)"/g, (_, path) =>
          `"component":(await import('${componentRoot}/${path}.svelte')).default`);

        return code;
      }

      return null;
    },

    resolveId(source) {
      if (source.startsWith('virtual:content')) {
        return source;
      }
    },

  };
}
