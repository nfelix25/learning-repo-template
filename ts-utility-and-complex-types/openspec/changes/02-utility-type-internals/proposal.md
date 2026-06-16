## Why

The standard library utility types (`Partial`, `Pick`, `Exclude`, `ReturnType`, etc.) are not magic — each is a mapped or conditional type you could write yourself. Seeing their source makes the whole utility type system legible.

## What Teaches

How `Partial`, `Required`, `Readonly` follow from modifier mechanics; how `Pick` and `Omit` filter keys; how `Exclude`, `Extract`, and `NonNullable` are distribution one-liners; a preview of how `ReturnType` and `Parameters` use `infer`.

## Prereqs

- `01-mapped-type-anatomy`

## Success criterion

The test suite in `lessons/02-utility-type-internals/utility-types.test.ts` passes.
