## Why

Before TypeScript 4.0, there was no good way to type a `concat` function that takes two tuples and returns a new tuple with the combined elements. The only options were overloads for each arity or losing the tuple structure entirely. Variadic tuple types (`[...T, ...U]`) solved this, and they're what makes typed `compose`/`pipe` and `Result.all` possible.

## What Teaches

`[...T, ...U]` variadic tuple syntax; rest elements in tuple types (and their relaxed position in TypeScript 4.0); typed `compose`/`pipe` implementations; parameter spreading in generic functions; connection to collector patterns like `Result.all`.

## Prereqs

- [13-recursive-types](../13-recursive-types/proposal.md)

## Success criterion

The test suite in `lessons/14-variadic-tuple-types/variadic-tuples.test.ts` passes.
