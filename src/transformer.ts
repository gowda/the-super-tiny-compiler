import ASTNode, { Type } from './syntax-tree/node';
import traverser from './syntax-tree/traverser';
import Visitor from './syntax-tree/visitor';

export default function transformer(ast: ASTNode): ASTNode {
  const visitor: Visitor = {
    [Type.PROGRAM](node: ASTNode): ASTNode {
      return {
        ...node,
        children: node.children.map((child): ASTNode => {
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

  return traverser(ast, visitor) as ASTNode;
}
