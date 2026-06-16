## Why

Combining `infer` with tuples and mapped types unlocks a class of "unpack and transform" utilities that appear constantly in library type definitions. Variadic tuple spreads (TS 4.0+) make typed function composition possible without a wall of overloads.

## What Teaches

Inferring tuple element types with `infer`; variadic tuple spreads `[...T, ...U]`; inferring from mapped type values; chained inference — using one `infer` result to drive another conditional; TS 4.0 generic spread behavior.

## Prereqs

- `08-infer`
- `11-recursive-types`

## Version note

Variadic tuple types were introduced in TypeScript 4.0 and extended in TypeScript 4.2 (leading and middle rest elements). See `sources.md`.

## Success criterion

The test suite in `lessons/12-advanced-inference-patterns/advanced-inference.test.ts` passes.
