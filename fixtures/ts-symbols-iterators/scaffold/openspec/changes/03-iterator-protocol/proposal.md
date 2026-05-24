## Why

Establishes the iterator contract — the pull-based protocol that all iteration in JavaScript builds on. Implements a manual iterator without generators to expose the protocol shape clearly.

## What Teaches

`IteratorResult<T>` shape, `next()`, optional `return()` for cleanup, optional `throw()`, the done-is-final contract.

## Prereqs

02-well-known-symbols

## Success criterion

The test suite in `lessons/03-iterator-protocol/iterator.test.ts` passes.
