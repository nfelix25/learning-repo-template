## Why

Two recurring frustrations in TypeScript: literal types get widened when you don't want them to, and validating a value against a type forces you to lose its narrow type. `satisfies` and `const` type parameters close both gaps.

## What Teaches

`satisfies` — validating a type without widening; `as const` — forcing literal type preservation; `const` type parameters (TS 5.0) — preserving literal inference through generic function calls; when `satisfies` beats an explicit annotation; combining `satisfies` with mapped type constraints.

## Prereqs

- `01-mapped-type-anatomy`
- `03-union-algebra`

## Success criterion

The test suite in `lessons/16-satisfies-and-const-parameters/satisfies.test.ts` passes.
