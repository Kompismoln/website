import type { PageContent, ComponentContent } from '$lib/ssg/types';
import fs from 'node:fs/promises';
import { globSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import config from '$lib/ssg/config';
import { error, redirect } from '@sveltejs/kit';

const filetypes = ['js', 'ts', 'json', 'yaml', 'yml', 'md'];

/* Try all filetypes in order, return content of first find.
 * `searchPath` is the path from svelte params in load()
 */
export const loadPageContent = async (searchPath: string) => {
  // This redirect has no effect in production, handle redirects on webserver instead
  if (searchPath === config.indexFile) throw redirect(301, '/');

  // Rename site root to index file
  searchPath = searchPath === '' ? config.indexFile : searchPath;

  let page: PageContent | ComponentContent | null = null; 

  for (const ext of filetypes) {
    const filePath = path.join(config.contentRoot, `${searchPath}.${ext}`);
    try {
      page = await parseFile(filePath);
      break;
    } catch (error: any) {
      /* Files/modules not found simply indicates that next filetype should be tried.
       * If no files exist in the path a 404 is the appropriate response.
       * All other errors are thrown at the user ungracefully.
       */
      if (['ENOENT', 'ERR_MODULE_NOT_FOUND'].includes(error.code)) {
        continue;
      }
      throw error;
    }
  }

  if (!page) {
    error(404, searchPath);
  }

  return await resolveFragments(page);
};

/* Return a list of all paths in src/lib/content/ with an allowed filetype.
 * This function only runs on 'npm run build'
 */
export const loadEntries = () => {
  const pattern = path.join(config.contentRoot, `**/*.@(${filetypes.join('|')})`);

  return (
    globSync(pattern)
      // Strip contentRoot and file extension so that the paths mirrors site paths
      .map((file) => path.parse(path.relative(config.contentRoot, file)))
      // Ignore fragment files
      .filter(({ name }) => name?.[0] !== '_')
      // Alias index file to the empty path (site root)
      .map(({ dir, name }) => {
        const p = path.join(dir, name);
        const entry = p === config.indexFile ? '' : p;

        console.log(`Adding entry: '${entry}'`);
        return entry;
      })
  );
};

/* Try to parse the suggested file path and return whats in it.
 * Should handle all `filetypes`
 */
const parseFile = async (filePath: string): Promise<any> => {
  const fileExt = path.extname(filePath);

  if (['.js', '.ts'].includes(fileExt)) {
    return (await import(/* @vite-ignore */ filePath)).default;
  }

  const fileContent = await fs.readFile(filePath, 'utf-8');

  if (fileExt === '.md') {
    const { data, content: body } = matter(fileContent);
    return { ...data, body };
  }
  if (['.yml', '.yaml'].includes(fileExt)) {
    return yaml.load(fileContent);
  }
  if (fileExt === '.json') {
    return JSON.parse(fileContent);
  }
  throw new Error(`Unexpected filetype: ${fileExt}`);
};

/* Recursively resolve all fragments (properties starting with _).
 */
const resolveFragments = async (obj: any) => {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = await resolveFragments(obj[i]);
    }
    return obj;
  } else if (typeof obj === 'object' && obj !== null) {
    obj = await parseFragment(obj);
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = await resolveFragments(obj[key]);
      }
    }
  }
  return obj;
};

/* Load the content of fragment file(s) and attach them to the content tree.
 * If the key is just an underscore, use fragment properties as default for
 * the object itself.
 * Otherwise, attach the fragment to the property with underscore removed.
 * Either way, delete the key for the fragment.
 */
const parseFragment = async (obj: any) => {
  const keys = Object.keys(obj);

  if ('_' in keys) {
    const fragment = await parseFile(path.join(config.contentRoot, obj._));
    delete obj._;
    obj = { ...fragment, ...obj };
  }

  const refs = keys.filter((key) => key[0] === '_');

  if (refs.length === 0) return obj;

  for (const i in refs) {
    const ref = refs[i];
    const fragment = await parseFile(path.join(config.contentRoot, obj[ref]));
    delete obj[ref];
    obj[ref.slice(1)] = fragment;
  }

  return obj;
};
