## Why

A type-safe WHERE clause means operators must be valid for the column's data type — you can't `LIKE` a number or compare a string with `>`. This lesson adds schema-aware predicate types and introduces recursive union types to model `AND`/`OR` trees.

## What Teaches

Typing WHERE conditions as schema-aware predicates; conditional operator validity per column data type; a recursive `WhereClause` type for `AND`/`OR` compound conditions.

## Prereqs

- `05-conditional-type-mechanics`
- `19-query-builder-schema-encoding`
- `20-query-builder-mapped-projections`

## Build piece role

WHERE clause. First load-bearing use of recursive types in the build piece. Adds `WhereCondition<S, T, Col>` and `WhereClause<S, T>`.

## Success criterion

The test suite in `lessons/22-query-builder-where-predicates/where.test.ts` passes.
