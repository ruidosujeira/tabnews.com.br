import { visit } from 'unist-util-visit';

function remarkNormalizeHeadings() {
  return (tree) => {
    visit(tree, 'heading', (node) => {
      if (node.depth === 1) {
        node.depth = 2;
      }
    });
  };
}

function rehypeNormalizeHeadings() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'h1') {
        node.tagName = 'h2';
      }
    });
  };
}

export function normalizeHeadingsPlugin() {
  return {
    remark: (processor) => processor.use(remarkNormalizeHeadings),
    rehype: (processor) => processor.use(rehypeNormalizeHeadings),
  };
}
