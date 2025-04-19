import z from 'zod';
import { browser } from '$app/environment';
import type { ComponentContent, PreparedMarkdown, ParsedHtml } from './types';

export { z };

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

const content = (obj: any) => {
  return z
    .object({ ...obj, component: z.string() })
    .strict()
    .transform((val) => process(val as ComponentContent));
};

const markdown = (options = {}) => {
  const prepare = (val: string): PreparedMarkdown => ({
    markdown: val,
    options
  });
  return z.string().transform(prepare).or(parsedHtml());
};

const parsedHtml = (): z.ZodType<ParsedHtml> =>
  z.object({
    html: z.string(),
    data: z.object({}).passthrough()
  });

const component = (allowed: string[] | null = null) => {
  const component = allowed
    ? z.enum(allowed as [string, ...string[]])
    : z.string();

  return z.object({ component }).passthrough();
};

const slots = (allowed = null) => z.record(component(allowed));

export const ze = { markdown, component, slots, content };
