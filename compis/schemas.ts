import z from 'zod';
import { browser } from '$app/environment';
import type { ComponentContent } from './types';

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
  const entries = await Promise.all(
    Object.entries(content).map(async ([key, val]) =>
      val && typeof val === 'object' && 'md' in val
        ? [key, await parse(val.md as string, content)]
        : [key, val]
    )
  );
  return Object.fromEntries(entries);
};

const markdown = () => {
  /* If markdown is string, mark it so it can be recognized by component-wide
   * transform.
   */
  const prepare = (val: string) => ({ md: val });
  return z.string().transform(prepare).or(parsedMarkdown());
};

const parsedMarkdown = () =>
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
  const process = (content: any) =>
    (browser ? processClient : processServer)(content);

  return z
    .object({ ...obj, component: z.string() })
    .strict()
    .transform(process);
};

export const ze = { markdown, component, slots, content };
