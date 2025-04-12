import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';

export default function replace() {
  return (tree: Root) => {
    visit(tree, 'text', (node) => {});
  };
}
