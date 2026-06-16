## Why

`infer` is type-level destructuring — it lets you extract a type from inside another type within a conditional branch. Without it, you can only check types; with it, you can pull types apart and name the pieces. It's how `ReturnType`, `Parameters`, `Awaited`, and dozens of utility types are implemented.

## What Teaches

The `infer` keyword and its placement rules; extracting return types, parameter types, and promise resolution types; using multiple `infer` in a single conditional; the covariant vs contravariant infer position rule — covariant positions yield unions, contravariant positions yield intersections; using `infer` inside template literal patterns.

## Prereqs

- [06-distributive-conditionals](../06-distributive-conditionals/proposal.md)

## Success criterion

The test suite in `lessons/07-infer/infer.test.ts` passes.
