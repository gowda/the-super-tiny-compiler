export enum Type {
  CALL_EXPRESSION = 'call_expression',
  EXPRESSION_STATEMENT = 'expression_statement',
  IDENTIFIER = 'identifier',
  PROGRAM = 'program',
  NUMBER_LITERAL = 'number_literal',
  STRING_LITERAL = 'string_literal',
}

export default interface Node {
  type: Type;
  value: string | null;
  children: Node[];
}
