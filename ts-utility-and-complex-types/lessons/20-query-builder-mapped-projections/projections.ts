// Lesson 20 — Query Builder: Mapped Projections
//
// SELECT mechanics: maps column selections back to TypeScript primitive types.
// Imports AppSchema and DatabaseSchema from lesson 19.

import type { DatabaseSchema } from '../19-query-builder-schema-encoding/schema'

type DataTypeMap = {
  string: string
  number: number
  boolean: boolean
  date: Date
}

// Produce a union of all column name string literals for table T in schema S.
export type ColumnNames<
  S extends DatabaseSchema,
  T extends keyof S & string
> = keyof S[T] & string

// Produce the TypeScript primitive type for column Col in table T.
// Includes `| null` when the column's `nullable` is `true`.
export type ColumnType<
  S extends DatabaseSchema,
  T extends keyof S & string,
  Col extends keyof S[T]
> = S[T][Col] extends { dataType: infer D; nullable: infer N }
  ? D extends keyof DataTypeMap
    ? N extends true
      ? DataTypeMap[D] | null
      : DataTypeMap[D]
    : never
  : never

// Produce an object type mapping each selected column to its ColumnType.
export type SelectResult<
  S extends DatabaseSchema,
  T extends keyof S & string,
  Cols extends ColumnNames<S, T>
> = {
  [K in Cols]: ColumnType<S, T, K>
}
