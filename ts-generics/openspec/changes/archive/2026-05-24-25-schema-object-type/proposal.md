## Why

Object schemas are the most frequently used schema type in practice. Implementing `object()` requires a mapped type that transforms a shape object (`{ name: StringSchema, age: NumberSchema }`) into an inferred output type (`{ name: string, age: number }`) — applying everything from lesson 08 in a real library context.

## What Teaches

`z.object()` with `{ [K in keyof Shape]: Shape[K]['_output'] }` mapped type output; handling optional fields via wrapping; `Partial`, `Pick`, `Omit` methods on object schemas; the excess property checking and mapped type edge cases.

## Prereqs

- [24-schema-primitives-and-infer-pattern](../24-schema-primitives-and-infer-pattern/proposal.md)
- [08-mapped-types](../08-mapped-types/proposal.md)

## Success criterion

The test suite in `lessons/25-schema-object-type/schema.test.ts` passes (new tests added, all prior schema tests remain live).
