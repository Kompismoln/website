import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import yaml from 'js-yaml';

async function loadSectionData(fileName: string) {
  const filePath = path.resolve(process.cwd(), 'src/lib/content/', fileName);
  const extension = path.extname(fileName);

  if (extension === '.js' || extension === '.ts') {
    return (await import(/* @vite-ignore */ filePath)).default;
  }

  const fileContent = await fs.readFile(filePath, 'utf-8');

  if (extension === '.md') {
    const { data: frontmatter, content: markdownContent } = matter(fileContent);
    return {
      ...frontmatter,
      body: marked.parse(markdownContent)
    };
  } else if (extension === '.yaml' || extension === '.yml') {
    return yaml.load(fileContent);
  } else if (extension === '.json') {
    return JSON.parse(fileContent);
  }
  return {};
}

export async function load() {
  try {
    const hero = await loadSectionData('hero.md');
    const prospects = await loadSectionData('prospects.yaml');
    const nav = await loadSectionData('nav.yaml');

    return {
      sections: { hero, prospects, nav }
    };
  } catch (e) {
    console.error('Error loading page data:', e);
    throw new Error('Failed to load page content');
  }
}

export const prerender = true;
