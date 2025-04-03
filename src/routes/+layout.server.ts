import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import yaml from 'js-yaml';

export const prerender = true;

type ContentData = {
  body?: string;
  [key: string]: any;
};

marked.use({
  async: false
});

export async function load() {
  const sections = ['nav', 'hero', 'prospects', 'projects', 'nextcloud', 'footer'];

  try {
    return {
      sections: await Promise.all(sections.map(async (name) => await loadContent(name)))
    };
  } catch (e) {
    console.error('Error loading page data:', e);
    throw new Error('Failed to load page content');
  }
}

async function loadContent(baseName: string) {
  const extensions = ['md', 'yaml', 'json', 'ts', 'js'];
  const basePath = path.resolve(process.cwd(), 'src/lib/content/', baseName);

  const foundExt = extensions.find((ext) => existsSync(`${basePath}.${ext}`));

  if (!foundExt) {
    const msg = `File not found: ${baseName} with extensions ${extensions.join(', ')}`;
    throw new Error(msg);
  }

  const filePath = `${basePath}.${foundExt}`;

  if (foundExt === 'js' || foundExt === 'ts') {
    return (await import(/* @vite-ignore */ filePath)).default;
  }

  const fileContent = await fs.readFile(filePath, 'utf-8');

  if (foundExt === 'md') {
    const { data: frontmatter, content: markdownContent } = matter(fileContent);
    return {
      ...frontmatter,
      body: marked.parse(markdownContent)
    };
  }
  if (foundExt === 'yaml') {
    const data = yaml.load(fileContent) as ContentData;
    if (data.body) {
      data.body = marked.parse(data.body) as string;
    }
    return data;
  }
  if (foundExt === 'json') {
    const data = JSON.parse(fileContent);
    if (data.body) {
      data.body = marked.parse(data.body);
    }
    return data;
  }
}
