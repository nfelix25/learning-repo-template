## Why

Real-world data is recursive — trees, JSON, nested configs. Before TypeScript 3.7, modeling these required interface workarounds because direct recursive type aliases were rejected. TypeScript 3.7 removed that restriction, enabling direct recursive type aliases. This lesson covers the patterns and their limits.

## What Teaches

Recursive type aliases (TypeScript 3.7+); the JSON type definition; `DeepPartial<T>` and `DeepReadonly<T>` patterns; "type instantiation is excessively deep" errors and the intermediate-alias escape hatch; `infer` in recursive conditional types.

## Prereqs

- [08-mapped-types](../08-mapped-types/proposal.md)
- [07-infer](../07-infer/proposal.md)

## Success criterion

The test suite in `lessons/13-recursive-types/recursive.test.ts` passes.
