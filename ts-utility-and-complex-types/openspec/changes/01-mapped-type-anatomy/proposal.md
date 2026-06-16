## Why

Mapped types are the structural backbone of nearly every utility type in TypeScript's standard library. Understanding their anatomy — key iteration, modifier syntax, and key remapping — is the prerequisite for reconstructing any utility type from scratch.

## What Teaches

The mapped type output shape (`{ [K in keyof T]: ... }`); property modifiers `+?`, `-?`, `+readonly`, `-readonly`; key remapping with `as`; filtering keys by mapping them to `never`.

## Prereqs

None.

## Success criterion

The test suite in `lessons/01-mapped-type-anatomy/mapped-types.test.ts` passes.
