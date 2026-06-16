## Why

Unions are TypeScript's primary tool for modeling "one of these shapes." Discriminated unions and exhaustive narrowing are everyday patterns in real TS codebases — and they feed directly into conditional type distribution in later lessons.

## What Teaches

Union as set union; discriminated unions and the discriminant property pattern; tagged union state modeling (`idle | loading | success | error`); `never` as the union identity element; exhaustive narrowing with `switch`.

## Prereqs

None.

## Success criterion

The test suite in `lessons/03-union-algebra/union-algebra.test.ts` passes.
