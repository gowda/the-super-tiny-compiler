import Node, { Type } from './syntax-tree/node';
import Visitor from './syntax-tree/visitor';
import traverser from './syntax-tree/traverser';

export default function codeGenerator(tree: Node): string {
  const visitor: Visitor = {
    [Type.PROGRAM](node: Node): string {
      return node.children.map(codeGenerator).join('\n');
    },
    [Type.EXPRESSION_STATEMENT](node: Node): string {
      return (`${codeGenerator(node.children[0])};`);
    },
    [Type.CALL_EXPRESSION](node: Node): string {
      return (
        `${node.value}(${node.children.map(codeGenerator).join(', ')})`
      );
    },
    [Type.IDENTIFIER](node: Node): string {
      return node.value as string;
    },
    [Type.NUMBER_LITERAL](node: Node): string {
      return node.value as string;
    },
    [Type.STRING_LITERAL](node: Node): string {
      return `"${node.value}"`;
    }
  }

  return traverser(tree, visitor) as string;
}
