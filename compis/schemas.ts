import z from 'zod';
import { browser } from '$app/environment';
import type { ComponentContent, PreparedMarkdown, ParsedHtml } from './types';

export { z };

/* The parse function in $lib/markdown depends and remark, rehype and countless plugins,
 * we don't want that in our bundle.
 * Alternative method: set parse to (val) => ({ html: val, data: { raw: true} } })
 * in browser to let unparsed markdown through.
 */
const processClient = (content: ComponentContent) => {
  return content;
};

const processServer = async (content: ComponentContent) => {
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

const markdown = (options = {}) => {
  /* If markdown is string, mark it so it can be recognized by component-wide
   * transform.
   */
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

const content = (obj: any) => {
  const process = browser ? processClient : processServer;

  return z
    .object({ ...obj, component: z.string() })
    .strict()
    .transform(process);
};

export const ze = { markdown, component, slots, content };
