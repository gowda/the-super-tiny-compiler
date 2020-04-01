export enum TokenType { PAREN = 'paren', NAME = 'name', NUMBER = 'number', STRING = 'string' }

export interface Token {
  type: TokenType;
  value: string;
}
