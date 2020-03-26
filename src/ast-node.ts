export interface ASTNode {
  type: string;
  name?: string;
  value?: string;
  params?: ASTNode[];
}
