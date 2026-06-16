## Why

Variadic tuple types are the bridge between TypeScript's type system and real function composition patterns. They let you type `pipe`, `curry`, and `concat` with exact argument shapes — eliminating the wall of overloads that previously made these patterns unergonomic to type.

## What Teaches

`[...T, ...U]` spread syntax; rest elements in leading and middle positions (TS 4.2); labeled tuple elements; `Head`, `Tail`, `Prepend`, `Append` operations at the type level; building a typed `pipe` function where the type system checks each composition step.

## Prereqs

- `08-infer`
- `11-recursive-types`

## Version note

Core variadic tuple syntax landed in TypeScript 4.0. Leading and middle rest elements (not just trailing) require TypeScript 4.2. See `sources.md`.

## Success criterion

The test suite in `lessons/13-variadic-tuple-types/variadic-tuples.test.ts` passes.
