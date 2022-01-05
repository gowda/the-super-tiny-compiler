/* eslint @typescript-eslint/no-use-before-define: ["error", {"variables": false}]  */
import ASTNode, { Type } from './syntax-tree/node';
import Visitor from './syntax-tree/visitor';
import traverser from './syntax-tree/traverser';

const visitor: Visitor = {
  [Type.PROGRAM]: (node: ASTNode) => node.children.map(generator).join('\n'),
  [Type.EXPRESSION_STATEMENT]: (node: ASTNode) =>
    `${generator(node.children[0])};`,
  [Type.CALL_EXPRESSION]: (node: ASTNode) =>
    `${node.value}(${node.children.map(generator).join(', ')})`,
  [Type.IDENTIFIER]: (node: ASTNode) => node.value as string,
  [Type.NUMBER_LITERAL]: (node: ASTNode) => node.value as string,
  [Type.STRING_LITERAL]: (node: ASTNode) => `"${node.value}"`,
};

const generator = (tree: ASTNode): string => traverser(tree, visitor) as string;

export default generator;
