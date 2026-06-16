// Lesson 22 — Query Builder: WHERE Predicates

import type { DatabaseSchema } from '../19-query-builder-schema-encoding/schema'
import type { TableColumn } from '../21-query-builder-template-literal-keys/column-refs'

// Valid operators for each column data type.
export type OperatorsFor<DT extends string> =
  DT extends 'string'  ? '=' | '!=' | 'LIKE' | 'NOT LIKE' :
  DT extends 'number'  ? '=' | '!=' | '>' | '>=' | '<' | '<=' :
  DT extends 'boolean' ? '=' | '!=' :
  DT extends 'date'    ? '=' | '!=' | '>' | '>=' | '<' | '<=' :
  never

// Map a column data type discriminant to its TypeScript primitive type.
type DataTypeMap = {
  string: string
  number: number
  boolean: boolean
  date: Date
}

// Single predicate for a qualified column reference (e.g. "users.name").
// Col must be a valid TableColumn for table T.
export type WhereCondition<
  S extends DatabaseSchema,
  T extends keyof S & string,
  Col extends TableColumn<S, T>
> = Col extends `${T}.${infer ColName}`
  ? ColName extends keyof S[T]
    ? S[T][ColName] extends { dataType: infer DT; nullable: infer N }
      ? DT extends keyof DataTypeMap
        ? {
            column: Col
            operator: OperatorsFor<DT>
            value: N extends true ? DataTypeMap[DT] | null : DataTypeMap[DT]
          }
        : never
      : never
    : never
  : never

// Recursive WHERE clause: a single condition, or AND/OR of nested clauses.
export type WhereClause<
  S extends DatabaseSchema,
  T extends keyof S & string
> =
  | WhereCondition<S, T, TableColumn<S, T>>
  | { AND: WhereClause<S, T>[] }
  | { OR: WhereClause<S, T>[] }
