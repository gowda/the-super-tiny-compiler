import { expect } from 'chai';
import { TokenType } from './token';
import tokenizer from './tokenizer';

describe('tokenizer', () => {
  it('returns empty array for blank input', () =>
    expect(tokenizer('     ')).to.be.empty);

  it('returns empty array for multi-line blank input', () =>
    expect(tokenizer('\n\n\n\n')).to.be.empty);

  it('returns single token for blank string input', () =>
    expect(tokenizer('"   "')).to.deep.eq([
      { type: TokenType.STRING, value: '   ' },
    ]));

  it('returns single token for number', () =>
    expect(tokenizer('123')).to.deep.eq([
      { type: TokenType.NUMBER, value: '123' },
    ]));

  it('returns tokens for a pair of balanced parenthesis', () =>
    expect(tokenizer('()')).to.deep.eq([
      { type: TokenType.PAREN, value: '(' },
      { type: TokenType.PAREN, value: ')' },
    ]));

  it('returns tokens for a function call', () =>
    expect(tokenizer('(fn 123 "string")')).to.deep.eq([
      { type: TokenType.PAREN, value: '(' },
      { type: TokenType.NAME, value: 'fn' },
      { type: TokenType.NUMBER, value: '123' },
      { type: TokenType.STRING, value: 'string' },
      { type: TokenType.PAREN, value: ')' },
    ]));

  it('returns tokens for nested function calls', () =>
    expect(tokenizer('(anotherfn 456 (fn 123 "string") "gnirts")')).to.deep.eq([
      { type: TokenType.PAREN, value: '(' },
      { type: TokenType.NAME, value: 'anotherfn' },
      { type: TokenType.NUMBER, value: '456' },
      { type: TokenType.PAREN, value: '(' },
      { type: TokenType.NAME, value: 'fn' },
      { type: TokenType.NUMBER, value: '123' },
      { type: TokenType.STRING, value: 'string' },
      { type: TokenType.PAREN, value: ')' },
      { type: TokenType.STRING, value: 'gnirts' },
      { type: TokenType.PAREN, value: ')' },
    ]));
});
