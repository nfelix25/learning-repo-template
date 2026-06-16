## Why

Generics express a relationship between types — that the input and output share a type variable, or that two parameters must match. When that relationship can't be encoded generically, the result is a generic that collapses to `any` or accepts invalid combinations. Overloads are the escape hatch, but they come with their own gotchas. Professional TypeScript authors know which tool belongs where.

## What Teaches

When generics lose the relationship between parameters; overload resolution order and why it matters; implementation signature visibility rules; generics that should be overloads and vice versa; the overload-as-escape-hatch pattern.

## Prereqs

- [11-inference-algorithm](../11-inference-algorithm/proposal.md)

## Success criterion

The test suite in `lessons/17-overloads-vs-generics/overloads.test.ts` passes.
