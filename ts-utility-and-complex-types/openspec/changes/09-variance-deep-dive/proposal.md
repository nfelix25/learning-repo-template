## Why

Covariance and contravariance explain which types are assignable to which — and the answer isn't always obvious. This is the lesson where the distribution confusion from lesson 07 and the `infer` position behavior from lesson 08 fully resolve into a coherent mental model.

## What Teaches

Covariance in return/output positions; contravariance in function parameter positions; invariance in mutable containers; the Liskov intuition for why parameters are contravariant; how variance affects `infer` results (union vs. intersection); explicit variance annotations `in`/`out` (TS 4.7).

## Prereqs

- `03-union-algebra`
- `04-intersection-algebra`
- `08-infer`

## Success criterion

The test suite in `lessons/09-variance-deep-dive/variance.test.ts` passes.
