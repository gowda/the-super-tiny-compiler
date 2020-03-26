import tokenizer from './tokenizer';
import parser from './parser';
import transformer from './transformer';
import codeGenerator from './code-generator';
import compiler from './compiler';
import assert from 'assert';
import { Token, TokenType } from './token';
import { AST, ASTNodeType } from './ast-node';

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

const ast: AST = {
  type: ASTNodeType.PROGRAM,
  body: [{
    type: ASTNodeType.CALL_EXPRESSION,
    name: 'add',
    params: [{
      type: ASTNodeType.NUMBER_LITERAL,
      value: '2'
    }, {
      type: ASTNodeType.CALL_EXPRESSION,
      name: 'subtract',
      params: [{
        type: ASTNodeType.NUMBER_LITERAL,
        value: '4'
      }, {
        type: ASTNodeType.NUMBER_LITERAL,
        value: '2'
      }]
    }]
  }]
};

const newAst: AST = {
  type: ASTNodeType.PROGRAM,
  body: [{
    type: ASTNodeType.EXPRESSION_STATEMENT,
    expression: {
      type: ASTNodeType.CALL_EXPRESSION,
      callee: {
        type: ASTNodeType.IDENTIFIER,
        name: 'add'
      },
      arguments: [{
        type: ASTNodeType.NUMBER_LITERAL,
        value: '2'
      }, {
        type: ASTNodeType.CALL_EXPRESSION,
        callee: {
          type: ASTNodeType.IDENTIFIER,
          name: 'subtract'
        },
        arguments: [{
          type: ASTNodeType.NUMBER_LITERAL,
          value: '4'
        }, {
          type: ASTNodeType.NUMBER_LITERAL,
          value: '2'
        }]
      }]
    }
  }]
};

assert.deepStrictEqual(tokenizer(input), tokens, 'Tokenizer should turn `input` string into `tokens` array');
assert.deepStrictEqual(parser(tokens), ast, 'Parser should turn `tokens` array into `ast`');
assert.deepStrictEqual(transformer(ast), newAst, 'Transformer should turn `ast` into a `newAst`');
assert.deepStrictEqual(codeGenerator(newAst), output, 'Code Generator should turn `newAst` into `output` string');
assert.deepStrictEqual(compiler(input), output, 'Compiler should turn `input` into `output`');

console.log('All Passed!'); // tslint:disable-line no-console
