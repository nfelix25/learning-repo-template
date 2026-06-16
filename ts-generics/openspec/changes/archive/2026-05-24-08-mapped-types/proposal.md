## Why

Mapped types are TypeScript's structural transformation mechanism — the type-level equivalent of `Array.prototype.map`. They're how `Partial`, `Readonly`, `Pick`, and `Record` work, and how library authors write utilities that transform entire object shapes without knowing the exact keys in advance.

## What Teaches

`[K in keyof T]` base pattern; `+/-` modifiers for optional and readonly; key remapping with `as`; filtering keys by mapping to `never`; the homomorphic vs non-homomorphic distinction and why it matters for modifier copy behavior.

## Prereqs

- [02-constraints-and-keyof](../02-constraints-and-keyof/proposal.md)

## Success criterion

The test suite in `lessons/08-mapped-types/mapped-types.test.ts` passes.
