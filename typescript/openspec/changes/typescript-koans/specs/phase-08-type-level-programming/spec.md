## ADDED Requirements

### Requirement: k-032 has the learner rebuild TypeScript stdlib utility types from scratch
Koan 032 SHALL present the learner with the signatures of `Pick`, `Omit`, `Exclude`, `Extract`, `NonNullable`, `Required`, `Readonly` and have them implement each from first principles, using only the primitives from Phases 1–7.

#### Scenario: All seven utility types are implemented correctly
- **WHEN** the learner implements all seven types
- **THEN** type assertions confirm they are equivalent to the stdlib versions across a comprehensive test matrix

#### Scenario: Implementations use no stdlib utilities internally
- **WHEN** the learner reviews their implementations
- **THEN** no implementation references the stdlib version it is implementing (enforced by comment convention, not compiler)

### Requirement: k-033 covers function type manipulation utilities
Koan 033 SHALL have the learner implement `Parameters<T>`, `ReturnType<T>`, `ConstructorParameters<T>`, `InstanceType<T>`, `ThisParameterType<T>`, and a `PromisifyAll<T>` that wraps all methods of an object type in `Promise`.

#### Scenario: Parameters and ReturnType are implemented from infer
- **WHEN** the learner implements both types
- **THEN** type assertions confirm correct extraction for overloaded functions (last overload wins)

#### Scenario: PromisifyAll wraps each method's return type in Promise
- **WHEN** the learner implements `PromisifyAll<T>`
- **THEN** type assertions confirm `{ add(a: number, b: number): number }` becomes `{ add(a: number, b: number): Promise<number> }`

### Requirement: k-034 covers string manipulation at the type level
Koan 034 SHALL have the learner implement type-level string operations using template literal types and recursion: `TrimLeft`, `TrimRight`, `Trim`, `Replace`, and `Join`. This is the synthesis koan for Phases 5–8.

#### Scenario: Trim removes leading and trailing whitespace from a string literal type
- **WHEN** the learner implements `Trim<S>`
- **THEN** type assertions confirm `Trim<"  hello  ">` is `"hello"`

#### Scenario: Replace substitutes all occurrences of a substring
- **WHEN** the learner implements `Replace<S, From, To>`
- **THEN** type assertions confirm `Replace<"hello world", "world", "TS">` is `"hello TS"`

#### Scenario: Join concatenates a tuple of strings with a separator
- **WHEN** the learner implements `Join<T extends string[], Sep extends string>`
- **THEN** type assertions confirm `Join<["a", "b", "c"], ".">` is `"a.b.c"`
