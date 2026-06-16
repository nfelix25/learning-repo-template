## Why

Generic APIs become tedious when callers must always specify every type argument. Defaults reduce ceremony — but TypeScript's all-or-nothing inference rule means you can't partially provide type arguments, which forces a design pattern (curried functions) that many developers encounter without understanding why it works.

## What Teaches

Default type parameters; TypeScript's all-or-nothing inference rule; the curried function workaround for partial type application; when defaults help vs when they hide errors by accepting types the author didn't intend.

## Prereqs

- [01-generic-fundamentals](../01-generic-fundamentals/proposal.md)

## Success criterion

The test suite in `lessons/03-generic-defaults-and-partial-inference/defaults.test.ts` passes.
