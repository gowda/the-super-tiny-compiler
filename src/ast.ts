import { ASTNode } from "./ast-node";

export interface AST {
  type: 'Program';
  body: ASTNode[];
}
