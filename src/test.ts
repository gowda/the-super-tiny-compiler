import tokenizer from './tokenizer';
import parser from './parser';
import transformer from './transformer';
import codeGenerator from './code-generator';
import compiler from './compiler';
import assert from 'assert';
import { Token, TokenType } from './token';
import ASTNode, { Type } from './syntax-tree/node';

const input  = '(add 2 (subtract 4 2))';
const output = 'add(2, subtract(4, 2));';

const tokens: Token[] = [
  { type: TokenType.PAREN,  value: '('        },
  { type: TokenType.NAME,   value: 'add'      },
  { type: TokenType.NUMBER, value: '2'        },
  { type: TokenType.PAREN,  value: '('        },
  { type: TokenType.NAME,   value: 'subtract' },
  { type: TokenType.NUMBER, value: '4'        },
  { type: TokenType.NUMBER, value: '2'        },
  { type: TokenType.PAREN,  value: ')'        },
  { type: TokenType.PAREN,  value: ')'        }
];

const ast: ASTNode = {
  type: Type.PROGRAM,
  value: null,
  children: [
    {
      type: Type.CALL_EXPRESSION,
      value: 'add',
      children: [
        {
          type: Type.NUMBER_LITERAL,
          value: '2',
          children: [],
        },
        {
          type: Type.CALL_EXPRESSION,
          value: 'subtract',
          children: [
            {
              type: Type.NUMBER_LITERAL,
              value: '4',
              children: [],
            },
            {
              type: Type.NUMBER_LITERAL,
              value: '2',
              children: [],
            },
          ]
        },
      ]
    }
  ]
};

const newAst: ASTNode = {
  type: Type.PROGRAM,
  value: null,
  children: [
    {
      type: Type.EXPRESSION_STATEMENT,
      value: null,
      children: [
        {
          type: Type.CALL_EXPRESSION,
          value: 'add',
          children: [
            {
              type: Type.NUMBER_LITERAL,
              value: '2',
              children: [],
            },
            {
              type: Type.CALL_EXPRESSION,
              value: 'subtract',
              children: [
                {
                  type: Type.NUMBER_LITERAL,
                  value: '4',
                  children: [],
                },
                {
                  type: Type.NUMBER_LITERAL,
                  value: '2',
                  children: [],
                }
              ]
            },
          ],
        }
      ],
    }
  ]
};

assert.deepStrictEqual(tokenizer(input), tokens, 'Tokenizer should turn `input` string into `tokens` array');
assert.deepStrictEqual(parser(tokens), ast, 'Parser should turn `tokens` array into `ast`');
assert.deepStrictEqual(transformer(ast), newAst, 'Transformer should turn `ast` into a `newAst`');
assert.deepStrictEqual(codeGenerator(newAst), output, 'Code Generator should turn `newAst` into `output` string');
assert.deepStrictEqual(compiler(input), output, 'Compiler should turn `input` into `output`');

console.log('All Passed!'); // tslint:disable-line no-console
