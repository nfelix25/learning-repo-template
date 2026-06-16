## Why

Exceptions lose type information — callers can't know what errors a function might throw without reading the source. `Result<E, T>` makes errors part of the function signature, forcing callers to handle them and preserving full type information on both the success and failure paths. This lesson designs the type and establishes the API surface that the next three lessons will implement.

## What Teaches

Discriminated union as an API design pattern; `Ok<T>` and `Err<E>` type definitions; why `Result` beats exceptions in some contexts — and when exceptions are still better; covariance of `E` and `T` and how it affects assignability.

## Prereqs

- [10-variance](../10-variance/proposal.md)
- [15-branded-types](../15-branded-types/proposal.md)
- [18-type-predicates-and-narrowing](../18-type-predicates-and-narrowing/proposal.md)

## Success criterion

The test suite in `lessons/19-result-type-design/result.test.ts` passes.
