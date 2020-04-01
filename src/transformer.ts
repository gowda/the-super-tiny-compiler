import Node, { Type } from './syntax-tree/node';
import traverser from './syntax-tree/traverser';
import Visitor from './syntax-tree/visitor';

export default function transformer(ast: Node): Node {
  const visitor: Visitor = {
    [Type.PROGRAM](node: Node): Node {
      return {
        ...node,
        children: node.children.map((child): Node => {
          if (child.type === Type.CALL_EXPRESSION) {
            return {
              type: Type.EXPRESSION_STATEMENT,
              value: null,
              children: [child],
            };
          }

          return child;
        })
      }
    }
  };

  return traverser(ast, visitor) as Node;
}
