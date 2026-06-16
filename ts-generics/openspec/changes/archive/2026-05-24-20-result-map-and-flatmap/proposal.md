## Why

`map` and `flatMap` let you transform the value inside a `Result` without unwrapping it — so error handling code doesn't interrupt the happy path. Getting the generic signatures right requires understanding variance and inference: the signatures must let TypeScript infer new type parameters from the callback's return type while keeping the error channel untouched.

## What Teaches

Implementing `map` with variance-aware signatures; `flatMap` and the monadic bind interface in TypeScript; `mapErr` for transforming the error channel independently; how to keep `E` and `T` inferred from call-site usage.

## Prereqs

- [19-result-type-design](../19-result-type-design/proposal.md)
- [11-inference-algorithm](../11-inference-algorithm/proposal.md)

## Success criterion

The test suite in `lessons/20-result-map-and-flatmap/result.test.ts` passes (new tests added, existing tests from lesson 19 remain live).
