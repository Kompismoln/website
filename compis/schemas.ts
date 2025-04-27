import fs from 'node:fs/promises';
import z from 'zod';
import { browser } from '$app/environment';
import type { ComponentContent, PreparedMarkdown, ParsedHtml } from './types';
import { shortHash } from './utils';
import { addVirtualComponent } from './component.loader';

/**
 * Provides the following utility schemas:
 *
 * - content
 *   Wrapper and a z.object type that allows a component property and parses
 *   markdown fields.
 *
 * - component
 *   An enumeration of component names that will be imported and
 *   made available under the property name.
 *
 * - markdown
 *   A z.string that is transformed to a PreparedMarkdown object.
 *
 * - slots
 *   A z.array with components that should render on the client.
 *
 */

/* Callback for content's transform function
 */

const extensions = {
  content: (obj: any) => {
    return z
      .object({ ...obj, component: z.string() })
      .strict()
  },

  markdown: () => {
    const prepare = (val: string): ComponentContent => {
      const hash = shortHash(val);
      const component = `virtual:${hash}`;
      addVirtualComponent(component, val);

      return { component };
    };
    return z.string().transform(prepare).or(c.parsedHtml());
  },

  parsedHtml: (): z.ZodType<ParsedHtml> =>
    z.object({
      html: z.string(),
      data: z.object({}).passthrough()
    }),

  component: (allowed: string[] | null = null) => {
    const component = allowed
      ? z.enum(allowed as [string, ...string[]])
      : z.string();

    return z.object({ component }).passthrough();
  },

  slots: (allowed = null) => z.record(c.component(allowed)),
image: () =>
  z.object({
    src: z.string(),
    alt: z.string()
  }),

link: () =>
  z.object({
    url: z.string(),
    text: z.string(),
    blank: z.boolean().optional()
  }),

button: () =>
  z.object({
    url: z.string(),
    text: z.string(),
    fill: z.boolean().optional()
  }),

social: () =>
  z.object({
    url: z.string(),
    platform: z.enum([
      'twitter',
      'facebook',
      'mastodon',
      'instagram',
      'youtube',
      'bluesky',
      'tiktok'
    ])
  }),
};
const process = async (content: ComponentContent) => {
  if (browser) {
    return content;
  }
  const parse = (await import('./markdown')).parse;
  const isPreparedMarkdown = (val: unknown): val is PreparedMarkdown => {
    return !!val && typeof val === 'object' && 'markdown' in val;
  };

  const entries = await Promise.all(
    Object.entries(content).map(async ([key, val]) =>
      isPreparedMarkdown(val) ? [key, await parse(val)] : [key, val]
    )
  );
  return Object.fromEntries(entries);
};


export const getSchema = async (component: string) => {
  const code = await fs.readFile(`src/lib/components/${component}.svelte`, 'utf8');

  const match = code.match(/export\s+const\s+schema\s*=\s*(c\.content\(([\s\S]*?)\));/);

  if (!match) {
    return
  }
  const schemaDefinition = match[1];

  return '';

}

export const c = extensions;
export default c;
