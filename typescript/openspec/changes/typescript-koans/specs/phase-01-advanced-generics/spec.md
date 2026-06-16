## ADDED Requirements

### Requirement: k-001 teaches generic constraints and keyof
Koan 001 SHALL cover `extends` constraints on type parameters, `keyof`, and accessing property types via indexed access (`T[K]`). The narrative SHALL explain how constraints narrow the universe of valid types without giving away the solutions.

#### Scenario: Learner implements a constrained generic function
- **WHEN** the learner solves k-001
- **THEN** runtime tests pass for a function that accepts any object and a key of that object, returning the value at that key with full type inference

#### Scenario: Type-level assertions verify constraint behavior
- **WHEN** the learner solves k-001
- **THEN** `Expect<Equal<>>` assertions confirm the return type is narrowed correctly (not `unknown` or `any`)

### Requirement: k-002 teaches generic defaults and inference from usage
Koan 002 SHALL cover default type parameters (`<T = string>`), inference from function arguments, and scenarios where TypeScript infers vs. where explicit annotation is required.

#### Scenario: Generic default is used when no argument provided
- **WHEN** the learner solves k-002
- **THEN** type-level assertions confirm a generic with default resolves to the default type when called without a type argument

#### Scenario: Inference overrides default when argument is provided
- **WHEN** the learner solves k-002
- **THEN** type-level assertions confirm the inferred type supersedes the default

### Requirement: k-003 teaches const type parameters (TypeScript 5.0)
Koan 003 SHALL explain that `const` type parameters infer literal types rather than widened types. The narrative SHALL contrast `<T>` (infers `string`) with `<const T>` (infers `"hello"`).

#### Scenario: Without const, string literals widen
- **WHEN** the learner examines the pre-written contrast example in k-003
- **THEN** `tsc` shows that a plain `<T>` generic infers `string` from `"hello"`

#### Scenario: With const, string literals are preserved
- **WHEN** the learner solves k-003
- **THEN** type assertions confirm `<const T>` preserves `"hello"`, `["a", "b"]` as readonly tuple, etc.

### Requirement: k-004 teaches NoInfer<T> (TypeScript 5.4)
Koan 004 SHALL explain that `NoInfer<T>` prevents TypeScript from using a particular argument as an inference site. The narrative SHALL motivate it with the canonical "default value should match inferred type, not drive inference" problem.

#### Scenario: Without NoInfer, default drives unwanted widening
- **WHEN** the learner examines the contrast example
- **THEN** the type error or unexpected widening demonstrates the problem NoInfer solves

#### Scenario: With NoInfer, type is inferred from primary site only
- **WHEN** the learner solves k-004
- **THEN** type assertions confirm the generic is inferred from the primary argument and the NoInfer-wrapped argument is checked against it without contributing to inference
