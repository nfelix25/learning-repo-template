## ADDED Requirements

### Requirement: k-005 covers typeof, instanceof, and in narrowing exhaustively
Koan 005 SHALL cover all three primitive narrowing guards, including edge cases: `typeof null === "object"`, `instanceof` with class hierarchies, and `in` for optional property detection. Runtime tests SHALL exercise the edge cases directly.

#### Scenario: Learner handles the typeof null trap
- **WHEN** the learner solves k-005
- **THEN** a runtime test verifies their implementation correctly distinguishes `null` from objects despite `typeof null === "object"`

#### Scenario: instanceof narrows to subclass in a hierarchy
- **WHEN** the learner solves k-005
- **THEN** type assertions confirm that after `instanceof SubClass`, the type is `SubClass` not `BaseClass`

### Requirement: k-006 covers discriminated unions completely
Koan 006 SHALL cover discriminated unions with a literal discriminant property, exhaustiveness checking via `never`, and the `satisfies` operator (TS 4.9, as prior art). The koan SHALL include a switch-based exhaustive handler that the learner must complete.

#### Scenario: Non-exhaustive switch produces a type error
- **WHEN** the learner's switch omits a union member
- **THEN** `tsc --noEmit` reports an error on the default branch (assigning to `never` fails)

#### Scenario: Exhaustive switch compiles clean
- **WHEN** the learner handles all union members
- **THEN** `tsc --noEmit` exits 0 and runtime tests confirm correct dispatch

### Requirement: k-007 covers custom type predicate functions
Koan 007 SHALL cover writing `(x: unknown): x is T` predicate functions, including predicates that narrow to interfaces and predicates composed from other predicates.

#### Scenario: Type predicate narrows in calling scope
- **WHEN** the learner writes a correct type predicate
- **THEN** type assertions confirm the variable is narrowed to `T` after the predicate call in an `if` branch

#### Scenario: Incorrect predicate body produces runtime mismatch
- **WHEN** the learner's predicate logic is wrong
- **THEN** a runtime test fails, demonstrating that the type predicate is a contract the developer must honor

### Requirement: k-008 covers assertion functions
Koan 008 SHALL cover `asserts x is T` and `asserts condition` assertion functions. The narrative SHALL explain how these differ from predicates: they throw on failure rather than returning a boolean.

#### Scenario: Assertion function narrows after call
- **WHEN** the learner correctly implements an assertion function
- **THEN** type assertions confirm the variable is narrowed to `T` for all code after the assertion call (not just in a branch)

#### Scenario: Assertion throws at runtime on invalid input
- **WHEN** the learner's assertion is called with invalid data
- **THEN** a runtime test confirms an error is thrown

### Requirement: k-009 covers inferred type predicates (TypeScript 5.5)
Koan 009 SHALL explain that TS 5.5 can infer `x is T` return types for functions with boolean-returning bodies that perform narrowing. The narrative SHALL contrast explicit predicates (k-007) with inferred ones.

#### Scenario: Filter with inferred predicate produces narrowed array type
- **WHEN** the learner writes a filter callback that TypeScript can infer as a type predicate
- **THEN** type assertions confirm `array.filter(isString)` returns `string[]`, not `(string | number)[]`

#### Scenario: Complex predicate patterns are inferred correctly
- **WHEN** the learner uses `!= null` or `typeof` checks in a predicate body
- **THEN** type assertions confirm the inferred predicate type is correct
