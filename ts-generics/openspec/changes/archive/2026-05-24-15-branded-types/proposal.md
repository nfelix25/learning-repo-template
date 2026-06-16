## Why

TypeScript's structural type system means two types with the same shape are interchangeable — including `UserId` and `OrderId` if both are `string`. Branded types create nominally-distinct types that the type checker enforces, preventing entire categories of runtime bugs caused by mismatched IDs, units, or domain values.

## What Teaches

Structural vs nominal typing tradeoffs; intersection branding pattern (`type UserId = string & { readonly _brand: "UserId" }`); `unique symbol` for stronger branding that can't be accidentally satisfied; branded type utilities and factory functions; when branding is worth the ceremony vs overkill.

## Prereqs

- [01-generic-fundamentals](../01-generic-fundamentals/proposal.md)

## Success criterion

The test suite in `lessons/15-branded-types/branded.test.ts` passes.
