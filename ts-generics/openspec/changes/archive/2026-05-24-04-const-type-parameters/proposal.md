## Why

Generic functions widen literal types to their base types by default — `["a", "b"]` becomes `string[]` instead of `readonly ["a", "b"]`. The `const` modifier on type parameters (TypeScript 5.0) fixes this without requiring callers to add `as const` at every call site. It's a small feature with a large ergonomic payoff for builder APIs and configuration utilities.

## What Teaches

The `const` modifier on type parameters; how it prevents literal widening inside generic functions; builder API patterns enabled by `const` type params; comparison with `as const` at the call site; the critical gotcha — a mutable constraint silently negates the `const` modifier, so `readonly` constraints must be used.

## Prereqs

- [03-generic-defaults-and-partial-inference](../03-generic-defaults-and-partial-inference/proposal.md)

## Success criterion

The test suite in `lessons/04-const-type-parameters/const-params.test.ts` passes.
