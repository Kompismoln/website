import matter from 'gray-matter';
import yaml from 'js-yaml';
import fs from 'node:fs/promises';
import path from 'node:path';
import config from './config';

import type { ContentTraverser } from './types';

/* Take a (mutable) anything and traverse all objects and arrays
 * Call callback on non-empty objects when filter returns true
 * Return nothing
 */
export const contentTraverser: ContentTraverser = async ({
  obj,
  callback,
  filter
}) => {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      await contentTraverser({ obj: obj[i], filter, callback });
    }
  }
  if (typeof obj === 'object' && obj !== null) {
    if (filter(obj)) {
      await callback(obj);
    }
    for (const key in obj) {
      await contentTraverser({ obj: obj[key], filter, callback });
    }
  }
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
