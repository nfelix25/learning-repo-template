## Why

The culminating build-piece lesson. Integrates every protocol from the syllabus — `Symbol.asyncIterator`, async generators, `Symbol.asyncDispose`, and `await using` — into a single composable, cancellable async pipeline.

## What Teaches

Implementing `AsyncIterable<T>` from scratch, composable pipeline operations as async generators, cancellation via `Symbol.asyncDispose`, `await using` as the consumer contract, type safety through generic transformations.

## Prereqs

09-async-generators, 11-explicit-resource-management

## Success criterion

All tests in `lessons/12-async-pipeline/async-pipeline.test.ts` pass. The API surface matches the specs in `specs/async-pipeline/spec.md`. `await using` on a `DisposableAsyncPipeline` terminates the source early.
