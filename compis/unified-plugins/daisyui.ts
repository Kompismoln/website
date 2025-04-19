import { h } from 'hastscript';
import { classnames } from 'hast-util-classnames'; // Utility for managing classes
import { visit } from 'unist-util-visit';

export default function addLinkClass() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'input') {
        if (node.properties?.type === 'checkbox') {
          node.properties.disabled = false;
          classnames(node, ['checkbox', 'checkbox-primary']);
        }
      }
      if (node.tagName === 'a') {
        classnames(node, ['link']);
      }
    });
  };
}
