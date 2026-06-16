## Why

TypeScript's narrowing is automatic for common patterns (`if (typeof x === "string")`), but for domain-specific checks — "is this a validated User?" — you need to teach it what you know. Type predicates and assertion functions are how you extend narrowing to arbitrary checks, and they come with a critical soundness risk: TypeScript cannot verify that your predicate actually checks what you claim.

## What Teaches

`is` type predicate functions; assertion functions (`asserts x is T`); narrowing with generic constraints; the pitfall of predicates that lie and the unsound narrowing that results; combining predicates with discriminated unions for exhaustive handling.

## Prereqs

- [05-conditional-types-basics](../05-conditional-types-basics/proposal.md)
- [15-branded-types](../15-branded-types/proposal.md)

## Success criterion

The test suite in `lessons/18-type-predicates-and-narrowing/predicates.test.ts` passes.
