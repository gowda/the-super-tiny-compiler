import { Token, TokenType } from './token';

interface TokenWithNextOffset {
  token: Token;
  offset: number;
}

function tokenizeFrom(input: string, offset: number): TokenWithNextOffset {
  if (input[offset] === '(') {
    return {
      token: { type: TokenType.PAREN, value: input[offset] },
      offset: ++offset,
    }
  }

  if (input[offset] === ')') {
    return {
      token: { type: TokenType.PAREN, value: input[offset] },
      offset: ++offset,
    };
  }

  const NUMBERS = /[0-9]/;
  if (NUMBERS.test(input[offset])) {
    let value = '';

    while (NUMBERS.test(input[offset])) {
      value += input[offset];
      ++offset;
    }

    return {
      token: { type: TokenType.NUMBER, value },
      offset,
    };

  }

  if (input[offset] === '"') {
    let value = '';
    ++offset;

    while (input[offset] !== '"') {
      value += input[offset];
      ++offset;
    }

    ++offset;

    return {
      token: { type: TokenType.STRING, value },
      offset
    };
  }

  const LETTERS = /[a-z]/i;
  if (LETTERS.test(input[offset])) {
    let value = '';

    while (LETTERS.test(input[offset])) {
      value += input[offset];
      ++offset;
    }

    return {
      token: { type: TokenType.NAME, value },
      offset
    };
  }

  throw new TypeError('I dont know what this character is: ' + input[offset]);
}

export default function tokenizer(input: string): Token[] {
  let offset = 0;
  const tokens: Token[] = [];

  while (offset < input.length) {
    const WHITESPACE = /\s/;
    while (WHITESPACE.test(input[offset]) && offset < input.length) {
      offset++;
    }

    if (offset >= input.length) {
      break;
    }

    const tokenWithNextOffset = tokenizeFrom(input, offset);

    tokens.push(tokenWithNextOffset.token);
    offset = tokenWithNextOffset.offset;
  }

  return tokens;
}
