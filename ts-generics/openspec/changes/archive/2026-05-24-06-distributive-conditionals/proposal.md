## Why

When you apply a conditional type to a union, TypeScript does something surprising — it distributes the conditional over each union member and recombines the results. This behavior powers `Extract` and `Exclude`, but it also causes subtle bugs when the distribution is unintended. Understanding it is essential for writing correct conditional types.

## What Teaches

Why conditional types distribute over unions when applied to a naked type parameter; how to suppress distribution by wrapping with `[T]`; practical gotchas where unexpected unions emerge; identifying when distribution is intended vs a trap.

## Prereqs

- [05-conditional-types-basics](../05-conditional-types-basics/proposal.md)

## Success criterion

The test suite in `lessons/06-distributive-conditionals/distributive.test.ts` passes.
