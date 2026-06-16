## ADDED Requirements

### Requirement: Expect type utility
The `test-utils.ts` module SHALL export an `Expect<T extends true>` type that accepts only `true` as its type argument, causing a compile error when `T` resolves to `false`.

#### Scenario: True passes
- **WHEN** `Expect` is used with a type that resolves to `true`
- **THEN** the type alias compiles without error

#### Scenario: False fails
- **WHEN** `Expect` is used with a type that resolves to `false`
- **THEN** TypeScript reports a type error at that line

### Requirement: Equal type utility
The `test-utils.ts` module SHALL export an `Equal<X, Y>` type that resolves to `true` if and only if `X` and `Y` are the same type, and `false` otherwise. It SHALL use the contravariant function type trick (not simple `extends` assignability) so that it correctly distinguishes `any` from other types and detects structural differences that `extends` alone misses.

#### Scenario: Identical types are equal
- **WHEN** `Equal<string, string>` is evaluated
- **THEN** it resolves to `true`

#### Scenario: Different types are not equal
- **WHEN** `Equal<string, number>` is evaluated
- **THEN** it resolves to `false`

#### Scenario: any is not equal to string
- **WHEN** `Equal<any, string>` is evaluated
- **THEN** it resolves to `false`

#### Scenario: Union order does not matter
- **WHEN** `Equal<string | number, number | string>` is evaluated
- **THEN** it resolves to `true`

### Requirement: Prose explanation of variance trick
The `test-utils.ts` file SHALL include a comment block explaining why the `(<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2)` form is used instead of `X extends Y & Y extends X`, covering: why simple assignability is insufficient, what "deferred conditional types" means in this context, and why `any` is handled correctly by this approach.

#### Scenario: Explanation present
- **WHEN** a developer opens `test-utils.ts`
- **THEN** the variance trick rationale is visible before the type definitions
