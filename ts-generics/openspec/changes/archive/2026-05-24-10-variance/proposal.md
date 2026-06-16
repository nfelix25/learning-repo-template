## Why

Variance errors are among the most common and frustrating in professional TypeScript codebases. "Type X is not assignable to type Y" errors involving arrays, functions, or callbacks often trace back to variance rules that most developers never learn explicitly. This lesson gives you the mental model to read and fix these errors on sight.

## What Teaches

Covariance and contravariance defined; function parameters are contravariant — method bivariance is a deliberate but unsound exception; generic type positions and their variance; the `in`/`out` variance modifiers added in TypeScript 4.7; why `ReadonlyArray<Dog>` is not assignable to `ReadonlyArray<Animal>`.

## Prereqs

- [02-constraints-and-keyof](../02-constraints-and-keyof/proposal.md)

## Success criterion

The test suite in `lessons/10-variance/variance.test.ts` passes.
