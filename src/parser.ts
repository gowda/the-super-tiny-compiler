/**
 * ============================================================================
 *                                 ヽ/❀o ل͜ o\ﾉ
 *                                THE PARSER!!!
 * ============================================================================
 */

import { Token, TokenType } from './token';

/**
 * For our parser we're going to take our array of tokens and turn it into an
 * AST.
 *
 *   [{ type: TokenType.PAREN, value: '(' }, ...]   =>   { type: 'Program', body: [...] }
 */

// Okay, so we define a `parser` function that accepts our array of `tokens`.
export default function parser(tokens: Token[]) {

  // Again we keep a `current` variable that we will use as a cursor.
  let current = 0;

  // But this time we're going to use recursion instead of a `while` loop. So we
  // define a `walk` function.
  function walk() {

    // Inside the walk function we start by grabbing the `current` token.
    let token = tokens[current];

    switch(token.type) {
      case TokenType.NUMBER:
        // Found a token, we'll increment `current`.
        current++;

        // And we'll return a new AST node called `NumberLiteral` and setting its
        // value to the value of our token.
        return {
          type: 'NumberLiteral',
          value: token.value,
        };
      case TokenType.STRING:
        // We have a string we will do the same as number and create a
        // `StringLiteral` node.
        current++;

        return {
          type: 'StringLiteral',
          value: token.value,
        };
      case TokenType.PAREN:
        // We're going to look for CallExpressions. We start this off when we
        // encounter an open parenthesis.
        if (token.value === '(') {
          // We'll increment `current` to skip the parenthesis since we don't care
          // about it in our AST.
          token = tokens[++current];

          // We create a base node with the type `CallExpression`, and we're going
          // to set the name as the current token's value since the next token after
          // the open parenthesis is the name of the function.
          const node = {
            type: 'CallExpression',
            name: token.value,
            params: [] as any[],
          };

          // We increment `current` *again* to skip the name token.
          token = tokens[++current];

          // And now we want to loop through each token that will be the `params` of
          // our `CallExpression` until we encounter a closing parenthesis.
          //
          // Now this is where recursion comes in. Instead of trying to parse a
          // potentially infinitely nested set of nodes we're going to rely on
          // recursion to resolve things.
          //
          // To explain this, let's take our Lisp code. You can see that the
          // parameters of the `add` are a number and a nested `CallExpression` that
          // includes its own numbers.
          //
          //   (add 2 (subtract 4 2))
          //
          // You'll also notice that in our tokens array we have multiple closing
          // parenthesis.
          //
          //   [
          //     { type: TokenType.PAREN,  value: '('        },
          //     { type: TokenType.NAME,   value: 'add'      },
          //     { type: TokenType.NUMBER, value: '2'        },
          //     { type: TokenType.PAREN,  value: '('        },
          //     { type: TokenType.NAME,   value: 'subtract' },
          //     { type: TokenType.NUMBER, value: '4'        },
          //     { type: TokenType.NUMBER, value: '2'        },
          //     { type: TokenType.PAREN,  value: ')'        }, <<< Closing parenthesis
          //     { type: TokenType.PAREN,  value: ')'        }, <<< Closing parenthesis
          //   ]
          //
          // We're going to rely on the nested `walk` function to increment our
          // `current` variable past any nested `CallExpression`.

          // So we create a `while` loop that will continue until it encounters a
          // token with a `type` of `TokenType.PAREN` and a `value` of a closing
          // parenthesis.
          while (
            (token.type !== TokenType.PAREN) ||
            (token.type === TokenType.PAREN && token.value !== ')')
          ) {
            // we'll call the `walk` function which will return a `node` and we'll
            // push it into our `node.params`.
            node.params.push(walk());
            token = tokens[current];
          }

          // Finally we will increment `current` one last time to skip the closing
          // parenthesis.
          current++;

          // And return the node.
          return node;
        }
      default:
        // We haven't recognized the token type by now we're going to
        // throw an error.
        throw new TypeError(`Unrecognized token: ${token.type}`);
    }
  }

  // Now, we're going to create our AST which will have a root which is a
  // `Program` node.
  const ast = {
    type: 'Program',
    body: [] as any[],
  };

  // And we're going to kickstart our `walk` function, pushing nodes to our
  // `ast.body` array.
  //
  // The reason we are doing this inside a loop is because our program can have
  // `CallExpression` after one another instead of being nested.
  //
  //   (add 2 2)
  //   (subtract 4 2)
  //
  while (current < tokens.length) {
    ast.body.push(walk());
  }

  // At the end of our parser we'll return the AST.
  return ast;
}
