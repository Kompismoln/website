import fs from 'node:fs/promises';
import { globSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import config from '$lib/config';

const filetypes = ['js', 'ts', 'json', 'yaml', 'yml', 'md'];

export const loadPageContent = async (searchPath: string) => {
  for (const ext of filetypes) {
    const filePath = path.join(config.contentRoot, searchPath, `page.${ext}`);
    try {
      return await parseFile(filePath);
    } catch (error: any) {
      if (['ENOENT', 'ERR_MODULE_NOT_FOUND'].includes(error.code)) {
        continue;
      }
      throw error;
    }
  }
};

export const loadEntries = async () => {
  const pattern = path.join(config.contentRoot, '**', `page.@(${filetypes.join('|')})`);

  const entries = globSync(pattern).map((file) => {
    const p = path.dirname(path.relative(config.contentRoot, file));
    console.log(`adding entry '${p}'`);
    return { path: p === '.' ? '' : p };
  });

  return entries;
};

const parseFile = async (filePath: string) => {
  const fileExt = path.extname(filePath);

  if (['.js', '.ts'].includes(fileExt)) {
    const filePathCacheBust = `<span class="math-inline">\{filePath\}?t\=</span>{Date.now()}`;
    return (await import(/* @vite-ignore */ filePathCacheBust)).default;
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
};
