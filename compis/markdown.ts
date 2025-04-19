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
import type { Root } from 'mdast';

import parseHeadings from './unified-plugins/headings';
import addLinkClass from './unified-plugins/daisyui';
import parseSlots from './unified-plugins/slots';
import {
  remarkDefinitionList,
  defListHastHandlers
} from './unified-plugins/definitionList';

import type { PreparedMarkdown } from './types';

export const parse = async (preparedMarkdown: PreparedMarkdown) => {
  try {
    const result = await unified()
      /* This is safe to remove because no plugin is using frontmatter yet,
       * it's left here for the future.
       */
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
