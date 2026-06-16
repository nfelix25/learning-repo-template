## Why

Arrays are the second most common schema type. Adding `z.array()` is straightforward — but adding `z.lazy()` for recursive schemas (e.g., a tree node that contains an array of tree nodes) requires confronting TypeScript's recursive inference limits, which produces one of the most confusing error messages in the language: "type instantiation is excessively deep."

## What Teaches

`z.array()` and its output type inference; `z.lazy()` for self-referential schemas; how TypeScript handles recursive generic inference; "type instantiation too deep" errors in the schema context and the intermediate alias escape hatch.

## Prereqs

- [25-schema-object-type](../25-schema-object-type/proposal.md)
- [13-recursive-types](../13-recursive-types/proposal.md)

## Success criterion

The test suite in `lessons/26-schema-array-and-recursion/schema.test.ts` passes (new tests added, all prior schema tests remain live).
