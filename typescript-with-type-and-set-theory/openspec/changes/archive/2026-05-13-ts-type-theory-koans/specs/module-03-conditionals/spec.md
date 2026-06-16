## ADDED Requirements

### Requirement: Koan 01 — Basic conditional types
The koan SHALL introduce `A extends B ? X : Y` as a type-level ternary. It SHALL frame this as a set membership test: "if the set A is a subset of B, yield X, otherwise yield Y." Learner SHALL fill in simple conditional type expressions.

#### Scenario: Conditional resolves to true branch
- **WHEN** learner evaluates `"cat" extends string ? "yes" : "no"`
- **THEN** result is `"yes"`

#### Scenario: Conditional resolves to false branch
- **WHEN** learner evaluates `number extends string ? "yes" : "no"`
- **THEN** result is `"no"`

#### Scenario: Building IsString utility
- **WHEN** learner implements `type IsString<T> = TODO`
- **THEN** `Equal<IsString<"hello">, true>` and `Equal<IsString<number>, false>` both pass

### Requirement: Koan 02 — Distributive conditional types
The koan SHALL teach that when `T` is a bare (naked) type parameter, `T extends U ? X : Y` distributes over union members — it maps the conditional across each member separately and re-unions the results. This is analogous to set-builder notation: `{ f(x) | x ∈ T }`. The koan SHALL include a case where the distribution produces a surprising result.

#### Scenario: Distribution over union
- **WHEN** learner evaluates `type Dist<T> = T extends string ? "S" : "N"` applied to `string | number`
- **THEN** result is `"S" | "N"` (not a single branch)

#### Scenario: Preventing distribution with wrapping
- **WHEN** learner wraps T: `type NoDist<T> = [T] extends [string] ? "S" : "N"` applied to `string | number`
- **THEN** result is `"N"` (the whole union is tested at once)

#### Scenario: Filtering a union
- **WHEN** learner implements `type OnlyStrings<T> = T extends string ? T : never`
- **THEN** `Equal<OnlyStrings<"a" | 1 | "b" | true>, "a" | "b">` passes

### Requirement: Koan 03 — infer: pattern matching on types
The koan SHALL introduce `infer R` as destructuring / pattern matching at the type level. It SHALL build several standard utility types from scratch: `ReturnType<T>`, `ParameterTypes<T>`, and `UnwrapPromise<T>`.

#### Scenario: Infer return type
- **WHEN** learner implements `type MyReturnType<T> = TODO` using `infer`
- **THEN** `Equal<MyReturnType<() => number>, number>` passes

#### Scenario: Infer first parameter
- **WHEN** learner implements `type FirstParam<T> = TODO` using `infer`
- **THEN** `Equal<FirstParam<(a: string, b: number) => void>, string>` passes

#### Scenario: Infer array element type
- **WHEN** learner implements `type ElementType<T> = TODO`
- **THEN** `Equal<ElementType<string[]>, string>` passes

### Requirement: Koan 04 — Recursive conditional types
The koan SHALL introduce recursion in the type system. It SHALL build `DeepReadonly<T>` and `Flatten<T>` (unwrap nested arrays) from scratch. Comments SHALL draw the analogy to recursive functions, with a base case and recursive case.

#### Scenario: DeepReadonly on nested object
- **WHEN** learner implements `type DeepReadonly<T> = TODO`
- **THEN** `Equal<DeepReadonly<{ a: { b: string } }>, { readonly a: { readonly b: string } }>` passes

#### Scenario: Flatten nested array
- **WHEN** learner implements `type Flatten<T> = TODO`
- **THEN** `Equal<Flatten<string[][]>, string>` passes

### Requirement: Koan 05 — Building standard utility types
The koan SHALL re-implement `NonNullable<T>`, `Partial<T>`, `Required<T>`, `Readonly<T>`, `Pick<T, K>`, and `Omit<T, K>` from scratch using conditional types and mapped types. Each re-implementation SHALL have tests matching the built-in behavior.

#### Scenario: Implementing NonNullable
- **WHEN** learner implements `type MyNonNullable<T> = TODO`
- **THEN** `Equal<MyNonNullable<string | null | undefined>, string>` passes

#### Scenario: Implementing Partial
- **WHEN** learner implements `type MyPartial<T> = TODO`
- **THEN** `Equal<MyPartial<{ a: string; b: number }>, { a?: string; b?: number }>` passes

#### Scenario: Implementing Pick
- **WHEN** learner implements `type MyPick<T, K extends keyof T> = TODO`
- **THEN** `Equal<MyPick<{ a: string; b: number; c: boolean }, "a" | "b">, { a: string; b: number }>` passes
