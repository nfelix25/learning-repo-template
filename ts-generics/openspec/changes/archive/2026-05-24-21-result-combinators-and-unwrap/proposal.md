## Why

`map` and `flatMap` keep you in the `Result` context. Eventually you need to consume the value — either by providing a default for the error case, by pattern-matching both branches, or by explicitly throwing if the error case shouldn't occur. These are the terminal operations that complete the `Result` API.

## What Teaches

`fold`/`match` for exhaustive handling of both branches; `unwrapOr` and `unwrapOrElse` for extracting the value with a fallback; `getOrThrow` for intentional boundary points; how TypeScript narrows after a discriminant check.

## Prereqs

- [20-result-map-and-flatmap](../20-result-map-and-flatmap/proposal.md)

## Success criterion

The test suite in `lessons/21-result-combinators-and-unwrap/result.test.ts` passes (new tests added, all prior result tests remain live).
