import type { SiteContent } from '$lib/ssg/types';
import fs from 'node:fs/promises';
import { globSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import config from '$lib/config';

const contentDir = path.resolve(process.cwd(), config.contentRoot);

export const loadPageContent = async (searchPath: string) => {
  const siteContent = await loadSiteContent(searchPath);
  return siteContent[searchPath];
};

export const loadSiteContent = async (searchPath?: string) => {
  const pattern = path.join(contentDir, searchPath ?? '**', 'page.@(yaml|md|json|js|ts)');
  const files = globSync(pattern);

  const getPath = (file: string) => {
    const p = path.dirname(path.relative(contentDir, file));
    return p === '.' ? '' : p;
  };

  return Object.fromEntries(
    await Promise.all(
      files.map(async (file) => {
        const path = getPath(file);
        const content = await parseFile(file);
        return [path, content];
      })
    )
  );
};

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

export const siteContent = (await loadSiteContent()) as SiteContent;
