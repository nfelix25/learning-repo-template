## Why

`infer` is the pattern-match operator of TypeScript's type system — the primitive behind `ReturnType`, `Parameters`, `Awaited`, and countless custom utilities. Understanding its placement rules and how covariant vs. contravariant positions produce different results is essential for writing or reading any advanced type library.

## What Teaches

`infer` as a pattern-match binding in conditional types; placement rules (only in the `extends` clause); multiple `infer` bindings in one type; covariant positions (object properties, return types) produce a union; contravariant positions (function parameters) produce an intersection; the last-signature caveat for overloaded functions.

## Prereqs

- `05-conditional-type-mechanics`

## Version note

`infer` and the covariant/contravariant position behavior were introduced in TypeScript 2.8. The current handbook covers basic usage; the version-specific behavior (intersection in contravariant positions) is documented in the TS 2.8 release notes — see `sources.md`.

## Success criterion

The test suite in `lessons/08-infer/infer.test.ts` passes.
