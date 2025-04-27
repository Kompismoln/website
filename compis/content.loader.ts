import matter from 'gray-matter';
import yaml from 'js-yaml';
import fs from 'node:fs/promises';

import { globSync } from 'node:fs';
import path from 'node:path';

import type { PageContent } from './types';
import { conformComponent } from './component.loader';
import config from './config';
import { contentTraverser } from './utils';

const filetypes = ['js', 'ts', 'json', 'yaml', 'yml', 'md'];

/**
 * The Page Content Loader.
 *
 * Takes a path, returns a server rendered page:
 * - Infer a filePath from the searchPath
 * - Find and parse the file
 * - Resolve fragments
 * - Validate and transform all components
 * - Throw meaningful errors along the way
 *
 *
 * Where 404?
 * I'm not sure it's needed. This only runs on build and 404's obscured
 * my stacktraces. They weren't even working on the client in build, probably
 * because this function doesn't run there 🤔
 *
 */
export const load = async ({ params }: any) => {
  // Rename site root to index file
  const searchPath = params.path === '' ? config.indexFile : params.path;

  const collectedPage = await collectPage(searchPath);
  const processedPage = await processPage(collectedPage);
  return processedPage;
};

/* Find pae and recurse in content tree and
 * - Replace all fragments with data from fragment files
 */
export const collectPage = async (searchPath: string): Promise<PageContent> => {
  const rawPage = await findPageContent(searchPath)
  const page = await contentTraverser({
    obj: rawPage,
    filter: (obj) => Object.keys(obj).some((key: string) => key[0] === '_'),
    callback: parseFragment
  });
  return page;
}

/* Recurse in content tree and
 * - Validate & transform all components
 */
export const processPage = async (page: PageContent): Promise<PageContent> => {

  page = await contentTraverser({
    obj: page,
    filter: (obj) => 'component' in obj,
    callback: conformComponent
  });

  return page;
};

/* Probe all filetypes in content root for search path.
 */
export const findPageContent = async (searchPath: string) => {
  for (const ext of filetypes) {
    const filePath = path.join(config.contentRoot, `${searchPath}.${ext}`);
    try {
      const page = await parseFile(filePath);
      return page;
    } catch (error: any) {
      if (['ENOENT', 'ERR_MODULE_NOT_FOUND'].includes(error.code)) {
        continue;
      }
      throw error;
    }
  }
  throw new Error(`No file matched '${searchPath}.@(${filetypes.join('|')})'`);
};

/* Parse file path and return data.
 */
export const parseFile = async (filePath: string): Promise<any> => {
  const fileExt = path.extname(filePath);

  //if (['.js', '.ts'].includes(fileExt)) {
  //  return (await import(/* @vite-ignore */ filePath)).default;
  //}

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
  /* Unusual: This will only happen if filePath has an unsupported filetype
   */
  throw new Error(`unsupported extension: '${fileExt}'.`);
};

/* Load the content of fragment file(s) and attach them to the content tree.
 *
 * If the key is just an underscore, use fragment properties as default for
 * the object itself.
 *
 * Otherwise, attach the fragment to the property with underscore removed.
 *
 * In both cases, delete the reference (key with underscore).
 *
 * (Whoops this function relies on mutation, that will definitely cause
 * trouble some day lol)
 */
export const parseFragment = async (obj: any) => {
  const keys = Object.keys(obj);

  if (keys.includes('_')) {
    const fragment = await parseFile(path.join(config.contentRoot, obj._));
    delete obj._;
    Object.assign(obj, fragment);
  }

  const refs = keys.filter((key) => key[0] === '_');

  if (refs.length === 0) return obj;

  for (const ref of refs) {
    const fragment = await parseFile(path.join(config.contentRoot, obj[ref]));
    delete obj[ref];
    obj[ref.slice(1)] = fragment;
  }

  return obj;
};

/* Discover entries for sveltekit
 *
 * Runs only on build.
 *
 * All valid filetypes in content root are searched.
 * Any match is added as entry.
 *
 * SvelteKit will discover all non-orphan pages given the root page,
 * so this function isn't always needed.
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
