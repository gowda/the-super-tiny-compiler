/**
 * ============================================================================
 *                                  (۶* ‘ヮ’)۶”
 *                         !!!!!!!!THE COMPILER!!!!!!!!
 * ============================================================================
 */

/**
 * FINALLY! We'll create our `compiler` function. Here we will link together
 * every part of the pipeline.
 *
 *   1. input  => tokenizer   => tokens
 *   2. tokens => parser      => ast
 *   3. ast    => transformer => newAst
 *   4. newAst => generator   => output
 */

import tokenizer from './tokenizer';
import parser from './parser';
import transformer from './transformer';
import codeGenerator from './code-generator';

export default function compiler(input: any) {
  const tokens = tokenizer(input);
  const ast    = parser(tokens);
  const newAst = transformer(ast);
  const output = codeGenerator(newAst);

  // and simply return the output!
  return output;
}
