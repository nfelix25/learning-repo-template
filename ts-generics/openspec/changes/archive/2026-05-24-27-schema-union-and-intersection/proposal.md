## Why

`union` and `intersection` complete the core composition API. `union([a, b])` produces `Schema<A | B>` and `intersection(a, b)` produces `Schema<A & B>`. Both require applying conditional type extraction — using `infer` inside distributive conditionals to extract union member output types, and mapped types to merge intersection shapes.

## What Teaches

`z.union()` with discriminated union output inference; `z.intersection()` and its mapped type implementation; conditional types for extracting union member output types; discriminant key inference for discriminated unions.

## Prereqs

- [26-schema-array-and-recursion](../26-schema-array-and-recursion/proposal.md)
- [06-distributive-conditionals](../06-distributive-conditionals/proposal.md)

## Success criterion

The test suite in `lessons/27-schema-union-and-intersection/schema.test.ts` passes (new tests added, all prior schema tests remain live).
