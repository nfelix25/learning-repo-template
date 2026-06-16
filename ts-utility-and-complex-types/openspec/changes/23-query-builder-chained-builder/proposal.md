## Why

The builder pattern at the type level threads query state through method chains — each call returns a new, more-constrained type that encodes what has been configured so far. This is the type-level state machine at the heart of the build piece, and it's where variance and generic state threading become load-bearing.

## What Teaches

`QueryBuilder<State>` where `State` accumulates through method calls; each method returning a new builder type with updated state; covariance requirements for method chain composition; preventing invalid sequences at the type level.

## Prereqs

- `09-variance-deep-dive`
- `20-query-builder-mapped-projections`
- `21-query-builder-template-literal-keys`
- `22-query-builder-where-predicates`

## Build piece role

Builder chain. The type-level state machine core. Adds the full `QueryBuilder<State>` with `.select()`, `.where()`, `.orderBy()`, `.limit()` methods.

## Success criterion

The test suite in `lessons/23-query-builder-chained-builder/builder.test.ts` passes.
