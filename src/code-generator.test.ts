import { expect } from 'chai';
import codeGenerator from './code-generator';
import { Type } from './syntax-tree/node';

describe('codeGenerator', () => {
  it('returns blank string for empty program', () =>
    expect(
      codeGenerator({
        type: Type.PROGRAM,
        value: null,
        children: [],
      })
    ).to.deep.eq(''));

  it('returns string for program with only string', () =>
    expect(
      codeGenerator({
        type: Type.PROGRAM,
        value: null,
        children: [
          { type: Type.STRING_LITERAL, value: 'string', children: [] },
        ],
      })
    ).to.deep.eq('"string"'));

  it('returns number for program with only number', () =>
    expect(
      codeGenerator({
        type: Type.PROGRAM,
        value: null,
        children: [{ type: Type.NUMBER_LITERAL, value: '123', children: [] }],
      })
    ).to.deep.eq('123'));

  it('returns call representation for a program with call expression', () =>
    expect(
      codeGenerator({
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
      })
    ).to.deep.eq('fn(123, "string")'));

  it('returns call representation for a program with expression statemet', () =>
    expect(
      codeGenerator({
        type: Type.PROGRAM,
        value: null,
        children: [
          {
            type: Type.EXPRESSION_STATEMENT,
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
          },
        ],
      })
    ).to.deep.eq('fn(123, "string");'));

  it('returns call representation for a program with nested call expressions', () =>
    expect(
      codeGenerator({
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
      })
    ).to.deep.eq('anotherfn(456, fn(123, "string"), "gnirts")'));
});
