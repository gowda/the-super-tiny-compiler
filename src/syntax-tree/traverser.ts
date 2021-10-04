import ASTNode from './node';
import Visitor from './visitor';

export type TraverserFunction = (node: ASTNode, visitor: Visitor) => ASTNode | string;

export default (node: ASTNode, visitor: Visitor): ASTNode | string => {
  const method = visitor[node.type];

  if (method) {
    return method.call(method, node);
  }

  return node;
}
