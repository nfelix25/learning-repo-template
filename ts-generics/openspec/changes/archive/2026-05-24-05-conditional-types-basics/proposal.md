## Why

Conditional types are TypeScript's type-level `if` statement. Without them, you can't express "if T is an array, return the element type; otherwise return T itself." They unlock a whole class of utility types — `Awaited`, `NonNullable`, `Extract`, `Exclude` — and are a prerequisite for `infer`, distributivity, and recursive types.

## What Teaches

`T extends U ? X : Y` syntax; `never` as the bottom type and `unknown` as the top type; decoding `NonNullable`, `Extract`, `Exclude` from their definitions; the behavior of deferred evaluation when `T` is an unresolved type variable.

## Prereqs

- [02-constraints-and-keyof](../02-constraints-and-keyof/proposal.md)

## Success criterion

The test suite in `lessons/05-conditional-types-basics/conditional-types.test.ts` passes.
