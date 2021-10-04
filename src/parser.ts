import { Token, TokenType } from './token';
import ASTNode, { Type } from './syntax-tree/node';

export default function parser(tokens: Token[]): ASTNode {
  let current = 0;

  function processNumber(): ASTNode | null {
    if (tokens[current].type !== TokenType.NUMBER) {
      return null;
    }

    return {
      type: Type.NUMBER_LITERAL,
      value: tokens[current++].value,
      children: [],
    };
  }

  function processString(): ASTNode | null {
    if (tokens[current].type !== TokenType.STRING) {
      return null;
    }

    return {
      type: Type.STRING_LITERAL,
      value: tokens[current++].value,
      children: [],
    }
  }

  function processParen(): ASTNode | null {
    if (tokens[current].type !== TokenType.PAREN || tokens[current].value !== '(') {
      return null;
    }
    let token = tokens[++current];

    const node: ASTNode = {
      type: Type.CALL_EXPRESSION,
      value: token.value,
      children: [],
    };

    token = tokens[++current];

    while (
      current < tokens.length &&
      (
        (tokens[current].type !== TokenType.PAREN) ||
        (tokens[current].type === TokenType.PAREN && tokens[current].value !== ')')
      )
    ) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      node.children.push(processNode() as ASTNode);
    }

    // closing paren
    current++;

    return node;
  }

  function throwUnknownTokenException(): ASTNode | null {
    throw new TypeError(`Unknown token ${tokens[current].type}: ${tokens[current].value}`);
  }

  function processNode(): ASTNode | null {
    return processNumber() ||
      processString() ||
      processParen() ||
      throwUnknownTokenException();
  }

  const ast: ASTNode = {
    type: Type.PROGRAM,
    value: null,
    children: [],
  };

  while (current < tokens.length) {
    ast.children.push(processNode() as ASTNode);
  }

  return ast;
}
