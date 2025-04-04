import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const path = `${params.path ? params.path + '/' : ''}page`;
  const content = await loadContent(path);

  if (content) {
    return content;
  }

  error(404, `Content not found for ${path}`);
};

async function loadContent(baseName: string) {
  const extensions = ['md', 'yaml', 'json', 'ts', 'js'];
  const basePath = path.resolve(process.cwd(), 'src/lib/content/', baseName);
  const foundExt = extensions.find((ext) => existsSync(`${basePath}.${ext}`));

  if (!foundExt) {
    return;
  }

  const filePath = `${basePath}.${foundExt}`;

  if (foundExt === 'js' || foundExt === 'ts') {
    return (await import(/* @vite-ignore */ filePath)).default;
  }

  const fileContent = await fs.readFile(filePath, 'utf-8');

  if (foundExt === 'md') {
    const { data, content: body } = matter(fileContent);
    return { ...data, body };
  }
  if (foundExt === 'yaml') {
    return yaml.load(fileContent);
  }
  if (foundExt === 'json') {
    return JSON.parse(fileContent);
  }
}
