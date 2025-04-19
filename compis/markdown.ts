/**
 * Parse that markdown
 *
 * Features:
 * - Add basic DaisyUI classes
 * - Decrease headings
 * - Create toc from headings and put in data.
 * - Set placeholders for slots
 * - Unicode emoji support
 * - Definition lists
 * - Gfm
 * - Slightly extended table functions
 * - Can take options
 */
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkLint from 'remark-lint';
import remarkRehype from 'remark-rehype';
import remarkDirective from 'remark-directive';
import emoji from 'remark-emoji';
import {
  remarkExtendedTable,
  extendedTableHandlers
} from 'remark-extended-table';

import rehypeStringify from 'rehype-stringify';

import { unified } from 'unified';
import type { VFile } from 'vfile';

import parseHeadings from './unified-plugins/headings';
import addLinkClass from './unified-plugins/daisyui';
import parseSlots from './unified-plugins/slots';
import {
  remarkDefinitionList,
  defListHastHandlers
} from './unified-plugins/definitionList';

import type { PreparedMarkdown } from './types';

/* Take a prepared markdown object and return a { html, data } object.
 *
 * This function should really have a return type.
 * Why doesnt the linter complain?
 * Let's infer from parsedHtml (in schemas.ts) some day.
 *
 * Functionality buds here and moves to unified-plugins when worthy.
 * This will surely crystallize over time.
 */
export const parse = async (preparedMarkdown: PreparedMarkdown) => {
  try {
    const result = await unified()
      .use(() => (_, vfile: VFile) => {
        vfile.data.meta = { options: preparedMarkdown.options };
      })
      .use(remarkParse)
      .use(emoji, { accessible: true })
      .use(remarkLint)
      .use(parseHeadings)
      .use(parseSlots)
      .use(remarkGfm)
      .use(remarkDefinitionList)
      .use(remarkDirective)
      .use(remarkExtendedTable)

      .use(remarkRehype, {
        handlers: {
          ...extendedTableHandlers,
          ...defListHastHandlers
        }
      })
      .use(addLinkClass)

      .use(rehypeStringify)

      .process(preparedMarkdown.markdown);

    delete result.data.meta;
    return {
      html: String(result.value),
      data: result.data
    };
  } catch (error: any) {
    throw new Error(
      `Failed to parse input: "${preparedMarkdown.markdown.slice(0, 50)}" - ${error}`
    );
  }
};
