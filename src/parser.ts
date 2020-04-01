import { Token, TokenType } from './token';
import Node, { Type } from './syntax-tree/node';

export default function parser(tokens: Token[]): Node {
  let current = 0;

  function processNumber(): Node | null {
    if (tokens[current].type !== TokenType.NUMBER) {
      return null;
    }

    return {
      type: Type.NUMBER_LITERAL,
      value: tokens[current++].value,
      children: [],
    };
  }

  function processString(): Node | null {
    if (tokens[current].type !== TokenType.STRING) {
      return null;
    }

    return {
      type: Type.STRING_LITERAL,
      value: tokens[current++].value,
      children: [],
    }
  }

  function processParen(): Node | null {
    if (tokens[current].type !== TokenType.PAREN || tokens[current].value !== '(') {
      return null;
    }
    let token = tokens[++current];

    const node: Node = {
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
      node.children.push(processNode() as Node);
    }

    // closing paren
    current++;

    return node;
  }

  function throwUnknownTokenException(): Node | null {
    throw new TypeError(`Unknown token ${tokens[current].type}: ${tokens[current].value}`);
  }

  function processNode(): Node | null {
    return processNumber() ||
      processString() ||
      processParen() ||
      throwUnknownTokenException();
  }

  const ast: Node = {
    type: Type.PROGRAM,
    value: null,
    children: [],
  };

  while (current < tokens.length) {
    ast.children.push(processNode() as Node);
  }

  return ast;
}
