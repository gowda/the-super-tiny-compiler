/**
 * ============================================================================
 *                                   ⁽(◍˃̵͈̑ᴗ˂̵͈̑)⁽
 *                              THE TRANSFORMER!!!
 * ============================================================================
 */

/**
 * Next up, the transformer. Our transformer is going to take the AST that we
 * have built and pass it to our traverser function with a visitor and will
 * create a new ast.
 *
 * -----------------------------------------------------------------------------------------------
 *   Original AST                                |   Transformed AST
 * -----------------------------------------------------------------------------------------------
 *   {                                           |   {
 *     type: 'ASTNodeType.PROGRAM',              |     type: 'ASTNodeType.PROGRAM',
 *     body: [{                                  |     body: [{
 *       type: 'ASTNodeType.CALL_EXPRESSION',    |       type: 'ASTNodeType.EXPRESSION_STATEMENT',
 *       name: 'add',                            |       expression: {
 *       params: [{                              |         type: 'ASTNodeType.CALL_EXPRESSION',
 *         type: 'ASTNodeType.NUMBER_LITERAL',   |         callee: {
 *         value: '2'                            |           type: 'ASTNodeType.IDENTIFIER',
 *       }, {                                    |           name: 'add'
 *         type: 'ASTNodeType.CALL_EXPRESSION',  |         },
 *         name: 'subtract',                     |         arguments: [{
 *         params: [{                            |           type: 'ASTNodeType.NUMBER_LITERAL',
 *           type: 'ASTNodeType.NUMBER_LITERAL', |           value: '2'
 *           value: '4'                          |         }, {
 *         }, {                                  |           type: 'ASTNodeType.CALL_EXPRESSION',
 *           type: 'ASTNodeType.NUMBER_LITERAL', |           callee: {
 *           value: '2'                          |             type: 'ASTNodeType.IDENTIFIER',
 *         }]                                    |             name: 'subtract'
 *       }]                                      |           },
 *     }]                                        |           arguments: [{
 *   }                                           |             type: 'ASTNodeType.NUMBER_LITERAL',
 *                                               |             value: '4'
 * --------------------------------------------- |           }, {
 *                                               |             type: 'ASTNodeType.NUMBER_LITERAL',
 *                                               |             value: '2'
 *                                               |           }]
 *  (sorry the other one is longer.)             |         }
 *                                               |       }
 *                                               |     }]
 *                                               |   }
 * -----------------------------------------------------------------------------------------------
 */

import traverser from './traverser';
import { AST, ASTNodeType, ASTNode } from './ast-node';

// So we have our transformer function which will accept the lisp ast.
export default function transformer(ast: AST): AST {

  // We'll create a `newAst` which like our previous AST will have a
  // ASTNodeType.PROGRAM node.
  const newAst: AST = {
    type: ASTNodeType.PROGRAM,
    body: [],
  };

  // Next I'm going to cheat a little and create a bit of a hack. We're going
  // to use a property named `context` on our parent nodes that we're going to
  // push nodes to their parent's `context`. Normally you would have a better
  // abstraction than this, but for our purposes this keeps things simple.
  //
  // Just take note that the context is a reference *from* the old ast *to*
  // the new ast.
  ast._context = newAst.body;

  // We'll start by calling the traverser function with our ast and a visitor.
  traverser(ast, {

    // The first visitor method accepts any `ASTNodeType.NUMBER_LITERAL`
    [ASTNodeType.NUMBER_LITERAL]: {
      // We'll visit them on enter.
      enter(node: ASTNode, parent: ASTNode) {
        // We'll create a new node also named `ASTNodeType.NUMBER_LITERAL` that
        // we will push to the parent context.
        parent._context!.push({
          type: ASTNodeType.NUMBER_LITERAL,
          value: node.value,
        });
      },
    },

    // Next we have `StringLiteral`
    [ASTNodeType.STRING_LITERAL]: {
      enter(node: ASTNode, parent: ASTNode) {
        parent._context!.push({
          type: ASTNodeType.STRING_LITERAL,
          value: node.value,
        });
      },
    },

    // Next up, `ASTNodeType.CALL_EXPRESSION`.
    [ASTNodeType.CALL_EXPRESSION]: {
      enter(node: ASTNode, parent: ASTNode) {

        // We start creating a new node `ASTNodeType.CALL_EXPRESSION` with
        // a nested `ASTNodeType.IDENTIFIER`.
        let expression: ASTNode = {
          type: ASTNodeType.CALL_EXPRESSION,
          callee: {
            type: ASTNodeType.IDENTIFIER,
            name: node.name,
          },
          arguments: [],
        };

        // Next we're going to define a new context on the original
        // `ASTNodeType.CALL_EXPRESSION` node that will reference
        // the `expression`'s arguments so that we can push arguments.
        node._context = expression.arguments;

        // Then we're going to check if the parent node is
        // a `ASTNodeType.CALL_EXPRESSION`.
        // If it is not...
        if (parent.type !== ASTNodeType.CALL_EXPRESSION) {

          // We're going to wrap our `ASTNodeType.CALL_EXPRESSION` node with
          // an `ASTNodeType.EXPRESSION_STATEMENT`. We do this because
          // the top level `ASTNodeType.CALL_EXPRESSION` in JavaScript are
          // actually statements.
          expression = {
            type: ASTNodeType.EXPRESSION_STATEMENT,
            expression,
          };
        }

        // Last, we push our (possibly wrapped) `ASTNodeType.CALL_EXPRESSION`
        // to the `parent`'s `context`.
        parent._context!.push(expression);
      },
    }
  });

  // At the end of our transformer function we'll return the new ast that we
  // just created.
  return newAst;
}
