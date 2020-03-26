export enum Type { PAREN = 1, NAME, NUMBER, STRING};

export interface Token {
  type: Type;
  value: string;
}
