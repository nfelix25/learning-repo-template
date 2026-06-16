## Why

Running multiple operations in parallel and collecting their results is a fundamental pattern. `Result.all` takes a tuple of Results and returns a single Result — `Ok` with all values if all succeeded, `Err` with the first error if any failed. Implementing it correctly requires variadic tuple types for the heterogeneous input and produces real inference failures that mirror what you'll hit when authoring generic collector APIs.

## What Teaches

`Result.all` with variadic tuple type inference; heterogeneous tuple collectors; variance traps encountered during implementation; when to add explicit type annotations vs trust inference.

## Prereqs

- [21-result-combinators-and-unwrap](../21-result-combinators-and-unwrap/proposal.md)
- [13-recursive-types](../13-recursive-types/proposal.md)
- [14-variadic-tuple-types](../14-variadic-tuple-types/proposal.md)

## Success criterion

The test suite in `lessons/22-result-all-and-advanced-inference/result.test.ts` passes (new tests added, all prior result tests remain live).
