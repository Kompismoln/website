import fs from 'node:fs/promises';
import { globSync, existsSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import config from '$lib/config';

const filetypes = ['js', 'ts', 'json', 'yaml', 'md'];

export const loadPageContent = async (searchPath: string) => {
  const filePath = path.join(config.contentRoot, searchPath, 'page');
  const fileContent = await parseFile(filePath);
  return fileContent;
};

export const loadEntries = async (key: string) => {
  const pattern = path.join(config.contentRoot, '**', `page.@(${filetypes.join('|')})`);

  const entries = globSync(pattern).map((file) => {
    const p = path.dirname(path.relative(config.contentRoot, file));
    console.log(`adding entry '${p}'`);
    return { [key]: p === '.' ? '' : p };
  });

  return entries;
};

const parseFile = async (filePath: string) => {
  const fileExt = filetypes.find((ext) => existsSync(`${filePath}.${ext}`));

  if (!fileExt) {
    return;
  }

  filePath = `${filePath}.${fileExt}`;

  if (['js', 'ts'].includes(fileExt)) {
    return (await import(/* @vite-ignore */ filePath)).default;
  }

  const fileContent = await fs.readFile(filePath, 'utf-8');

  if (fileExt === 'md') {
    const { data, content: body } = matter(fileContent);
    return { ...data, body };
  }
  if (fileExt === 'yaml') {
    return yaml.load(fileContent);
  }
  if (fileExt === 'json') {
    return JSON.parse(fileContent);
  }
};
