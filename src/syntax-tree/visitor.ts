import ASTNode from './node';

export default interface Visitor {
  [index: string]: (node: ASTNode) => (ASTNode | string);
}
