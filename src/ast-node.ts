export enum ASTNodeType {
  CALL_EXPRESSION,
  EXPRESSION_STATEMENT,
  IDENTIFIER,
  PROGRAM,
  NUMBER_LITERAL,
  STRING_LITERAL
}

export interface ASTNode {
  type: ASTNodeType;
  name?: string;
  value?: string;
  callee?: ASTNode;
  params?: ASTNode[];
  arguments?: ASTNode[];
  expression?: ASTNode;
  body?: ASTNode[];
  _context?: ASTNode[];
}

export type AST = ASTNode;
