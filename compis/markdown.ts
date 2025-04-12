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

import parseHeadings from './unified-plugins/headings';
import replace from './unified-plugins/replace';
import parseSlots from './unified-plugins/slots';
import {
  remarkDefinitionList,
  defListHastHandlers
} from './unified-plugins/definitionList';

import type { VFile } from 'vfile';
import type { ComponentContent } from './types';

export const parse = async (val: string, content: ComponentContent) => {
  try {
    const result = await unified()
      /* This is safe to remove because no plugin is using frontmatter yet,
       * it's left here for the future.
       */
      .use(() => (_, vfile: VFile) => {
        vfile.data.frontmatter = content;
      })
      .use(remarkParse)
      .use(emoji, { accessible: true })
      .use(remarkLint)
      .use(replace)
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

      .use(rehypeStringify)

      .process(val);

    delete result.data.frontmatter;
    return {
      html: String(result.value),
      data: result.data
    };
  } catch (error: any) {
    throw new Error(`Failed to parse input: "${val.slice(0, 50)}" - ${error}`);
  }
};
