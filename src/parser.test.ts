import { expect } from 'chai';
import parser from './parser';
import { Type } from './syntax-tree/node';
import { TokenType } from './token';

describe('parser', () => {
  it('returns empty program for empty list', () =>
    expect(parser([])).to.deep.eq({
      type: Type.PROGRAM,
      value: null,
      children: [],
    }));

  it('returns right program for string token', () =>
    expect(parser([{ type: TokenType.STRING, value: 'string' }])).to.deep.eq({
      type: Type.PROGRAM,
      value: null,
      children: [{ type: Type.STRING_LITERAL, value: 'string', children: [] }],
    }));

  it('returns right program for number token', () =>
    expect(parser([{ type: TokenType.NUMBER, value: '123' }])).to.deep.eq({
      type: Type.PROGRAM,
      value: null,
      children: [{ type: Type.NUMBER_LITERAL, value: '123', children: [] }],
    }));

  it('returns right program for a call', () =>
    expect(
      parser([
        { type: TokenType.PAREN, value: '(' },
        { type: TokenType.NAME, value: 'fn' },
        { type: TokenType.NUMBER, value: '123' },
        { type: TokenType.STRING, value: 'string' },
        { type: TokenType.PAREN, value: ')' },
      ])
    ).to.deep.eq({
      type: Type.PROGRAM,
      value: null,
      children: [
        {
          type: Type.CALL_EXPRESSION,
          value: 'fn',
          children: [
            {
              children: [],
              type: Type.NUMBER_LITERAL,
              value: '123',
            },
            {
              children: [],
              type: Type.STRING_LITERAL,
              value: 'string',
            },
          ],
        },
      ],
    }));

  it('returns right program for nested function calls', () =>
    expect(
      parser([
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
      ])
    ).to.deep.eq({
      type: Type.PROGRAM,
      value: null,
      children: [
        {
          type: Type.CALL_EXPRESSION,
          value: 'anotherfn',
          children: [
            {
              children: [],
              type: Type.NUMBER_LITERAL,
              value: '456',
            },
            {
              type: Type.CALL_EXPRESSION,
              value: 'fn',
              children: [
                {
                  children: [],
                  type: Type.NUMBER_LITERAL,
                  value: '123',
                },
                {
                  children: [],
                  type: Type.STRING_LITERAL,
                  value: 'string',
                },
              ],
            },
            {
              children: [],
              type: Type.STRING_LITERAL,
              value: 'gnirts',
            },
          ],
        },
      ],
    }));
});
