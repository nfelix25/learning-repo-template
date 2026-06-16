## Why

TypeScript's structural type system can't distinguish `UserId` from `OrderId` when both are strings. Branded types add nominal-style identity without any runtime overhead — a practical pattern for domain modeling and validation boundaries in real codebases.

## What Teaches

The structural gap and why it matters; the brand pattern via intersection with a unique marker; `unique symbol` brands for stronger isolation; opaque type aliases; the "parsed, not validated" pattern for validation boundaries.

## Prereqs

- `03-union-algebra`
- `04-intersection-algebra`

## Success criterion

The test suite in `lessons/15-branded-nominal-types/branded-types.test.ts` passes.
