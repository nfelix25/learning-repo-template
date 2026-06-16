## Content manifest

### Outline

**Intro**: Once the schema is defined, the next challenge is: given a table and a set of selected column names, what is the TypeScript type of a result row? This lesson introduces `QueryState` and the first projection logic.

**Mechanic**: `ColumnNames<S, T>` produces the union of all column name strings for a given table. `DataTypeMap` is a lookup type mapping `Column["dataType"]` values to TypeScript primitive types. `ColumnType<S, T, Col>` uses `DataTypeMap` and the column's `nullable` flag to produce the correct TypeScript type for a single column, including `| null` when nullable. `SelectResult<S, T, Cols>` maps selected column names to their types via a mapped type.

**Worked example**: Show `ColumnNames<AppSchema, "users">` producing `"id" | "name" | "email" | "createdAt"`. Show `SelectResult<AppSchema, "users", "name" | "email">` producing `{ name: string; email: string }`. Show that selecting `"deletedAt"` from posts produces `Date | null`.

**Pitfalls**: The `DataTypeMap` lookup must be exhaustive — if a new `dataType` value is added to `Column`, the map must be updated or downstream types silently become `never`. Using a mapped type rather than a conditional type chain for the projection makes errors more readable.

**Exercise**: Add a `.select<Cols extends ColumnNames<S, T>>(...cols: Cols[])` method stub to a `QueryBuilder<S, T>` class; verify the return type narrows to only the selected columns.

### Build piece role

SELECT mechanics. Exports `ColumnNames`, `ColumnType`, and `SelectResult`. Introduces `QueryState`.
