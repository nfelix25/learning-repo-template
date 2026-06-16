## Why

JOIN merges two tables' column sets, but the type system needs to track which tables are joined and how their columns combine — with disambiguation when two joined tables share a column name. This lesson exercises intersection algebra and template literal column references together.

## What Teaches

Typing JOIN as a schema merge; intersection of column sets for the join result; updating `QueryState` to track joined tables; using `"table.column"` qualified references to disambiguate after a join; a `LEFT JOIN` variant where joined table columns become nullable.

## Prereqs

- `04-intersection-algebra`
- `19-query-builder-schema-encoding`
- `23-query-builder-chained-builder`

## Build piece role

JOIN mechanics. Adds `.join()` and `.leftJoin()` to the builder, expanding `QueryState` to track multiple tables.

## Success criterion

The test suite in `lessons/24-query-builder-join-types/joins.test.ts` passes.
