import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import yaml from 'js-yaml';

type ContentData = {
  body?: string;
  [key: string]: any;
};

marked.use({
  async: false
});

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
    const data = yaml.load(fileContent) as ContentData;
    if (data.body) {
      data.body = marked.parse(data.body) as string;
    }
    return data;
  } else if (extension === '.json') {
    const data = JSON.parse(fileContent);
    if (data.body) {
      data.body = marked.parse(data.body);
    }
  }
  return {};
}

export async function load() {
  try {
    const hero = await loadSectionData('hero.md');
    const prospects = await loadSectionData('prospects.yaml');
    const nav = await loadSectionData('nav.yaml');
    const projects = await loadSectionData('projects.yaml');
    const footer = await loadSectionData('footer.yaml');

    return {
      sections: { nav, hero, prospects, projects, footer }
    };
  } catch (e) {
    console.error('Error loading page data:', e);
    throw new Error('Failed to load page content');
  }
}

export const prerender = true;
