import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import yaml from 'js-yaml';

export const prerender = true;

type Section = {
  body?: string;
  [key: string]: any;
};

marked.use({
  async: false
});

export async function load() {
  const page = await loadContent('index');
  page.sections = page.sections.map((section: Section) => ({
    ...section,
    body: section?.body ? marked(section.body) : section.body
  }));

  try {
    return {
      sections: page.sections
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
