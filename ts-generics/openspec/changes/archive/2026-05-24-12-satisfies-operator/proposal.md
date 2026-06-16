## Why

Before `satisfies`, you had a painful choice: annotate a variable and lose the specific type (widening), or leave it unannotated and lose the type check. `satisfies` (TypeScript 4.9) threads the needle — it validates a value against a type without widening the inferred type. In professional codebases, it largely replaces unsafe `as` casts for configuration objects and constant maps.

## What Teaches

`satisfies` operator syntax and semantics; the difference between `satisfies`, explicit type annotation (`:`), and type cast (`as`); combining `satisfies` with `const` for precise literal inference; when `satisfies` beats an explicit annotation; cases where `satisfies` still widens.

## Prereqs

- [11-inference-algorithm](../11-inference-algorithm/proposal.md)

## Success criterion

The test suite in `lessons/12-satisfies-operator/satisfies.test.ts` passes.
