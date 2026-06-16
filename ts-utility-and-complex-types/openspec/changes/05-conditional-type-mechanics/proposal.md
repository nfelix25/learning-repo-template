## Why

Conditional types are the if-expressions of TypeScript's type system and the engine behind most advanced utility types. Their deferred vs. eager evaluation behavior is a common source of confusion that this lesson addresses directly.

## What Teaches

`T extends U ? X : Y` and what "assignable to" means precisely; deferred vs. eager evaluation in generic vs. concrete contexts; nested conditional types; the `{} extends T` and `any` gotchas; a preview of when to prefer overloads.

## Prereqs

- `01-mapped-type-anatomy`
- `03-union-algebra`

## Success criterion

The test suite in `lessons/05-conditional-type-mechanics/conditional-types.test.ts` passes.
