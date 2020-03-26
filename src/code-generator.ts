/**
 * ============================================================================
 *                               ヾ（〃＾∇＾）ﾉ♪
 *                            THE CODE GENERATOR!!!!
 * ============================================================================
 */

import { ASTNodeType } from "./ast-node";

/**
 * Now let's move onto our last phase: The Code Generator.
 *
 * Our code generator is going to recursively call itself to print each node in
 * the tree into one giant string.
 */

export default function codeGenerator(node: any): any {

  // We'll break things down by the `type` of the `node`.
  switch (node.type) {

    // If we have a `Program` node. We will map through each node in the `body`
    // and run them through the code generator and join them with a newline.
    case ASTNodeType.PROGRAM:
      return node.body.map(codeGenerator)
        .join('\n');

    // For `ExpressionStatement` we'll call the code generator on the nested
    // expression and we'll add a semicolon...
    case ASTNodeType.EXPRESSION_STATEMENT:
      return (
        codeGenerator(node.expression) +
        ';' // << (...because we like to code the *correct* way)
      );

    // For `CallExpression` we will print the `callee`, add an open
    // parenthesis, we'll map through each node in the `arguments` array and run
    // them through the code generator, joining them with a comma, and then
    // we'll add a closing parenthesis.
    case ASTNodeType.CALL_EXPRESSION:
      return (
        codeGenerator(node.callee) +
        '(' +
        node.arguments.map(codeGenerator)
          .join(', ') +
        ')'
      );

    // For `Identifier` we'll just return the `node`'s name.
    case ASTNodeType.IDENTIFIER:
      return node.name;

    // For `NumberLiteral` we'll just return the `node`'s value.
    case ASTNodeType.NUMBER_LITERAL:
      return node.value;

    // For `StringLiteral` we'll add quotations around the `node`'s value.
    case ASTNodeType.STRING_LITERAL:
      return '"' + node.value + '"';

    // And if we haven't recognized the node, we'll throw an error.
    default:
      throw new TypeError(`Unrecognized AST node type: ${node.type}`);
  }
}
