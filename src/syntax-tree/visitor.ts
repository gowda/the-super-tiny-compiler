import Node from './node';

export default interface Visitor {
  [index: string]: (node: Node) => (Node | string);
}
