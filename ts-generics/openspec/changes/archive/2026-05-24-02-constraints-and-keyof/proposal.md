## Why

Unconstrained generics accept anything, which makes the body of a generic function nearly useless — TypeScript won't let you access properties that aren't guaranteed to exist. Constraints are how you tell TypeScript what you know about `T`, and `keyof` is the essential companion for property-access patterns.

## What Teaches

`extends` for type constraints; `keyof` and `typeof` in constraint position; how constraints narrow inside the generic body; the key gotcha — a constrained `T` is not the same type as its constraint.

## Prereqs

- [01-generic-fundamentals](../01-generic-fundamentals/proposal.md)

## Success criterion

The test suite in `lessons/02-constraints-and-keyof/constraints.test.ts` passes.
