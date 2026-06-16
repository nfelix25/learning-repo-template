## Why

Recursive types unlock the ability to model JSON, deep transformations, and path extraction — patterns that appear constantly in real codebases. They also hit real compiler limits, and this lesson gives you the techniques to work within those limits without sacrificing correctness.

## What Teaches

Recursive type aliases in object/array positions (TS 3.7+); recursive conditional types (TS 4.1+); the `JSON` type pattern; `DeepReadonly`/`DeepPartial`; the "type instantiation is excessively deep" error and when it fires; the tail recursion accumulator pattern; why recursive types evaluate eagerly in some positions.

## Prereqs

- `01-mapped-type-anatomy`
- `05-conditional-type-mechanics`

## Version note

Two separate version gates: TypeScript 3.7 introduced recursive type aliases in object/array/tuple positions. TypeScript 4.1 introduced recursive *conditional* types (which are different and more powerful, but also more prone to depth errors). See `sources.md`.

## Success criterion

The test suite in `lessons/11-recursive-types/recursive-types.test.ts` passes.
