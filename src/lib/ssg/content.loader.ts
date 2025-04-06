import type { SiteContent } from '$lib/ssg/types';
import fs from 'node:fs/promises';
import { globSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import config from '$lib/config';

export default (await loadSiteContent()) as SiteContent;

async function loadSiteContent() {
  const contentDir = path.resolve(process.cwd(), config.contentRoot);
  const pattern = path.join(contentDir, '**', 'page.@(yaml|md|json|js|ts)');
  const files = globSync(pattern);

  const getSitePath = (file: string) => {
    const p = path.dirname(path.relative(contentDir, file));
    return p === '.' ? '' : p;
  };

  return Object.fromEntries(
    await Promise.all(files.map(async (file) => [getSitePath(file), await parseFile(file)]))
  );
}

async function parseFile(filePath: string) {
  const fileExt = path.extname(filePath);

  if (['.js', '.ts'].includes(fileExt)) {
    return (await import(/* @vite-ignore */ filePath)).default;
  }

  const fileContent = await fs.readFile(filePath, 'utf-8');

  if (fileExt === '.md') {
    const { data, content: body } = matter(fileContent);
    return { ...data, body };
  }
  if (fileExt === '.yaml') {
    return yaml.load(fileContent);
  }
  if (fileExt === '.json') {
    return JSON.parse(fileContent);
  }
}
