export enum TokenType { PAREN = 1, NAME, NUMBER, STRING }

export interface Token {
  type: TokenType;
  value: string;
}
