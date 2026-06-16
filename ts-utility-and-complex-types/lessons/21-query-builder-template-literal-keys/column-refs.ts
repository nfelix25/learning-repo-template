// Lesson 21 — Query Builder: Template Literal Column Refs

import type { DatabaseSchema } from '../19-query-builder-schema-encoding/schema'

// Produce a union of all valid "table.column" qualified strings for table T.
export type TableColumn<
  S extends DatabaseSchema,
  T extends keyof S & string
> = `${T}.${keyof S[T] & string}`

// Parse "table.column" → { table: ...; column: ... }, or never if no dot.
export type ParseTableColumn<Ref extends string> =
  Ref extends `${infer Table}.${infer Column}`
    ? { table: Table; column: Column }
    : never
