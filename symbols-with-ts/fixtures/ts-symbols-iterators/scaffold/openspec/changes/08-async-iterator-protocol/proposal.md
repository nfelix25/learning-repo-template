## Why

Extends the iterator protocol to async sources. Foundational for async generators, Streams consumption, and the async pipeline build piece.

## What Teaches

`AsyncIterator`, `Symbol.asyncIterator`, `for await...of`, async `return()`/`throw()`, async iteration contract.

## Prereqs

03-iterator-protocol

## Success criterion

The test suite in `lessons/08-async-iterator-protocol/async-iterator.test.ts` passes.
