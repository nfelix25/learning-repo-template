## Why

Distinguishes iterables (factories) from iterators (stateful cursors). Enables `for...of`, spread, and destructuring on custom objects.

## What Teaches

`[Symbol.iterator]()` implementation, `for...of` desugaring, `Array.from()`, multi-iteration semantics, iterator-iterable (returns `this`).

## Prereqs

03-iterator-protocol

## Success criterion

The test suite in `lessons/04-iterable-protocol/iterable.test.ts` passes.
