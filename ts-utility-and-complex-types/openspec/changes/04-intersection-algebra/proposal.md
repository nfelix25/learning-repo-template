## Why

Intersections are subtler than they look — they assert all constraints simultaneously rather than simply merging properties. The difference between intersection and interface extension matters in several practical scenarios, including mixins and branded types.

## What Teaches

`A & B` as "assignable to both"; when intersection produces `never`; intersection vs interface merging for duplicate properties; using intersections to compose constraints; the mixin pattern.

## Prereqs

- `03-union-algebra`

## Success criterion

The test suite in `lessons/04-intersection-algebra/intersection-algebra.test.ts` passes.
