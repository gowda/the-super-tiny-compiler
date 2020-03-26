/**
 * ============================================================================
 *                               ヾ（〃＾∇＾）ﾉ♪
 *                            THE CODE GENERATOR!!!!
 * ============================================================================
 */

import { AST, ASTNode, ASTNodeType } from './ast-node';

/**
 * Now let's move onto our last phase: The Code Generator.
 *
 * Our code generator is going to recursively call itself to print each node in
 * the tree into one giant string.
 */

export default function codeGenerator(node: AST): string {

  // We'll break things down by the `type` of the `node`.
  switch (node.type) {
    case ASTNodeType.PROGRAM:
      // We will map through each node in the `body` and run them through
      // the code generator and join them with a newline.
      return node.body!.map(codeGenerator)
        .join('\n');

    case ASTNodeType.EXPRESSION_STATEMENT:
      // We will call the code generator on the nested expression and we'll
      // add a semicolon...
      return (
        codeGenerator(node.expression!) +
        ';' // << (...because we like to code the *correct* way)
      );

    case ASTNodeType.CALL_EXPRESSION:
      // We will print the `callee`, add an open parenthesis, we'll map
      // through each node in the `arguments` array and run them through
      // the code generator, joining them with a comma, and then we'll
      // add a closing parenthesis.
      return (
        codeGenerator(node.callee!) +
        '(' +
        node.arguments!.map(codeGenerator)
          .join(', ') +
        ')'
      );

    case ASTNodeType.IDENTIFIER:
      // We will just return the `node`'s name.
      return node.name!;

    case ASTNodeType.NUMBER_LITERAL:
      // We will just return the `node`'s value.
      return node.value!;

    case ASTNodeType.STRING_LITERAL:
      // We will add quotations around the `node`'s value.
      return '"' + node.value + '"';

    default:
      // And if we haven't recognized the node.
      throw new TypeError(node.type);
  }
}
