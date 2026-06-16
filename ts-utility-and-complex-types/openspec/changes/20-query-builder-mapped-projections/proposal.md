## Why

`SELECT` in SQL picks specific columns — the type system needs to do the same, mapping a column selection back to an output shape with the correct primitive types. This lesson introduces `QueryState` and the first type-level projection logic.

## What Teaches

Deriving a union of valid column names from a schema table entry; typed `SELECT` state encoding which columns are selected; mapping column descriptor types back to primitive types (`string`, `number`, `Date`, etc.); handling nullable columns as `Type | null`.

## Prereqs

- `02-utility-type-internals`
- `19-query-builder-schema-encoding`

## Build piece role

SELECT mechanics. Introduces the `QueryState` type. Adds `ColumnNames<S, T>` and `SelectResult<S, T, Cols>`.

## Success criterion

The test suite in `lessons/20-query-builder-mapped-projections/projections.test.ts` passes.
