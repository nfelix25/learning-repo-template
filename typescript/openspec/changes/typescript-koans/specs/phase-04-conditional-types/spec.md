## ADDED Requirements

### Requirement: k-015 introduces conditional type syntax
Koan 015 SHALL cover `T extends U ? X : Y` syntax, nested conditionals, and using conditional types to implement `IsArray<T>`, `IsString<T>`, and similar simple type tests.

#### Scenario: Conditional type resolves correctly for each branch
- **WHEN** the learner implements a conditional type
- **THEN** type assertions cover both branches, including `never` input

#### Scenario: Nested conditionals produce multi-way discriminants
- **WHEN** the learner implements a 3-way conditional
- **THEN** type assertions confirm all three outcomes

### Requirement: k-016 covers distributive conditional types
Koan 016 SHALL explain that when `T` is a bare type parameter in `T extends U ? X : Y`, TypeScript distributes over union members. The narrative SHALL contrast `type Dist<T> = T extends ...` (distributes) with `type NonDist<T> = [T] extends [...]` (does not distribute).

#### Scenario: Distributive conditional expands over union
- **WHEN** the learner uses a distributive conditional with `string | number`
- **THEN** type assertions confirm the result is `X | Y` (one result per member), not `X`

#### Scenario: Non-distributive variant treats union as whole
- **WHEN** the learner wraps in `[T] extends [U]`
- **THEN** type assertions confirm the union is treated as a single unit

#### Scenario: Distributivity enables filtering union members
- **WHEN** the learner implements `Exclude<T, U>` from scratch
- **THEN** type assertions confirm `Exclude<string | number | boolean, number>` is `string | boolean`

### Requirement: k-017 covers the infer keyword
Koan 017 SHALL cover `infer` inside conditional types to extract sub-types: return types, parameter types, promise value types, and array element types. The narrative SHALL explain that `infer X` declares a type variable local to the `true` branch.

#### Scenario: infer extracts function return type
- **WHEN** the learner implements `MyReturnType<T>`
- **THEN** type assertions confirm correct extraction for functions returning primitives, objects, and void

#### Scenario: infer extracts element type from array
- **WHEN** the learner implements `ElementType<T>`
- **THEN** type assertions confirm `ElementType<string[]>` is `string` and `ElementType<never>` is `never`

#### Scenario: infer extracts resolved type from Promise
- **WHEN** the learner implements `Awaited<T>` (or a variant)
- **THEN** type assertions confirm `Promise<string>` unwraps to `string`

### Requirement: k-018 covers infer with extends constraints (TypeScript 5.4)
Koan 018 SHALL cover the TS 5.4 feature that allows `infer X extends SomeType` to simultaneously infer and constrain the captured type. The narrative SHALL show how this eliminates a follow-on conditional to narrow the inferred type.

#### Scenario: infer with constraint captures narrowed type
- **WHEN** the learner uses `infer X extends string` to extract a string-typed property
- **THEN** type assertions confirm the result is `string` (or a string subtype), not `string | undefined`

#### Scenario: Contrast with pre-5.4 pattern
- **WHEN** the learner examines the pre-written pre-5.4 version (using a separate `extends string` check)
- **THEN** both versions produce identical type-level results, illustrating what TS 5.4 simplifies

### Requirement: k-019 covers recursive conditional types
Koan 019 SHALL cover conditional types that reference themselves to implement `DeepAwaited`, `Flatten`, and similar recursions. The narrative SHALL explain TypeScript's deferred evaluation of recursive conditionals.

#### Scenario: Flatten recursively unwraps nested arrays
- **WHEN** the learner implements `Flatten<T>`
- **THEN** type assertions confirm `Flatten<number[][][]>` is `number`

#### Scenario: DeepAwaited unwraps nested Promises
- **WHEN** the learner implements `DeepAwaited<T>`
- **THEN** type assertions confirm `Promise<Promise<string>>` resolves to `string`
