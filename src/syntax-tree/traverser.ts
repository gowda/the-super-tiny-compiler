import Node from './node';
import Visitor from './visitor';

export type TraverserFunction = (node: Node, visitor: Visitor) => Node | string;

export default (node: Node, visitor: Visitor): Node | string => {
  const method = visitor[node.type];

  if (method) {
    return method.call(method, node);
  }

  return node;
}
