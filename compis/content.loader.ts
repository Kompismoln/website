import matter from 'gray-matter';
import yaml from 'js-yaml';
import fs from 'node:fs/promises';

import { globSync } from 'node:fs';
import path from 'node:path';
import { redirect } from '@sveltejs/kit';

import type { PageContent } from './types';
import { conformComponent } from './component.loader';
import config from './config';
import { contentTraverser } from './utils';

const filetypes = ['js', 'ts', 'json', 'yaml', 'yml', 'md'];

/* Find all valid paths in $lib/content and return them as an array
 * SvelteKit uses this on 'npm run build' to know what pages to build.
 */
export const discoverContentPaths = () => {
  const pattern = path.join(
    config.contentRoot,
    `**/*.@(${filetypes.join('|')})`
  );

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

        console.info(`Adding entry: '${entry}'`);
        return entry;
      })
  );
};

/* Try all filetypes in order, return content of first find.
 * `searchPath` is the path from svelte params in load()
 * Also parse fragments and validate components and convert markdown to html.
 * All other errors are thrown at the user ungracefully.
 */
export const loadPageContent = async (searchPath: string) => {
  // This redirect has no effect in production, handle redirects on webserver instead
  if (searchPath === config.indexFile) throw redirect(301, '/');

  // Rename site root to index file
  searchPath = searchPath === '' ? config.indexFile : searchPath;

  // Find page or throw
  let page = await findPageContent(searchPath);

  try {
    page = await processPage(page);
  } catch (error: any) {
    throw new Error(
      `Failed to process page '${searchPath}': ${error.message || error}`
    );
  }

  return page;
};

export const processPage = async (page: PageContent): Promise<PageContent> => {
  /*
   * Recursively resolve all fragments
   * (Content properties starting with underscore)
   */
  page = await contentTraverser({
    obj: page,
    filter: (obj) => Object.keys(obj).some((key: string) => key[0] === '_'),
    callback: parseFragment
  });

  /* Validate and parse markdown on all components
   */
  page = await contentTraverser({
    obj: page,
    filter: (obj) => 'component' in obj,
    callback: conformComponent
  });

  return page;
};

/* Probe all extensions in content root for the given path.
 * Cache found pages? Maybe not necessary, sveltekit probably does that already.
 */
export const findPageContent = async (searchPath: string) => {
  for (const ext of filetypes) {
    const filePath = path.join(config.contentRoot, `${searchPath}.${ext}`);
    try {
      return await parseFile(filePath);
    } catch (error: any) {
      /* Files/modules not found simply indicates that next filetype should be tried.
       */
      if (['ENOENT', 'ERR_MODULE_NOT_FOUND'].includes(error.code)) {
        continue;
      }
      throw error;
    }
  }
  throw new Error(`No file matched '${searchPath}.@(${filetypes.join('|')})'`);
};

/* Try to parse the suggested file path and return whats in it.
 * Should handle all `filetypes`
 */
export const parseFile = async (filePath: string): Promise<any> => {
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
  /* This will only happen if filePath has an unsupported filetype
   */
  throw new Error(`unsupported extension: '${fileExt}'.`);
};

/* Load the content of fragment file(s) and attach them to the content tree.
 * If the key is just an underscore, use fragment properties as default for
 * the object itself.
 * Otherwise, attach the fragment to the property with underscore removed.
 * Either way, delete the key for the fragment.
 */
export const parseFragment = async (obj: any) => {
  const keys = Object.keys(obj);

  if ('_' in keys) {
    const fragment = await parseFile(path.join(config.contentRoot, obj._));
    delete obj._;
    Object.assign(obj, fragment);
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
