export enum ASTNodeType {
  PROGRAM = 0,
  CALL_EXPRESSION,
  NUMBER_LITERAL,
  STRING_LITERAL,
  IDENTIFIER,
  EXPRESSION_STATEMENT
}

export interface ASTNode {
  type: ASTNodeType;
  name?: string;
  value?: string;
  params?: ASTNode[];
  body?: ASTNode[];
  _context?: any;
  callee?: ASTNode;
  arguments?: ASTNode[];
  expression?: ASTNode;
}
