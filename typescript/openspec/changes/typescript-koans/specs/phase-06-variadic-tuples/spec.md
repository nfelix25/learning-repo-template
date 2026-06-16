## ADDED Requirements

### Requirement: k-024 introduces tuple types and labeled elements
Koan 024 SHALL cover fixed-length tuple syntax, labeled tuple elements (`[name: string, age: number]`), optional tuple elements, and rest elements at the end. The narrative SHALL contrast tuples with arrays.

#### Scenario: Labeled tuple elements are accessible by index with correct type
- **WHEN** the learner defines a labeled tuple type
- **THEN** type assertions confirm `T[0]` is the first element type and `T["length"]` is a numeric literal

#### Scenario: Optional tuple elements are accessible
- **WHEN** the learner defines a tuple with optional trailing element
- **THEN** type assertions confirm the last element type is `T | undefined`

### Requirement: k-025 covers spread elements in tuple types
Koan 025 SHALL cover `[...T, U]`, `[U, ...T]`, and `[...T, ...U]` tuple spreads. The narrative SHALL explain these enable type-safe variadic function signatures.

#### Scenario: Prepend adds an element to the front of a tuple type
- **WHEN** the learner implements `Prepend<T extends unknown[], E>` using tuple spread
- **THEN** type assertions confirm `Prepend<[string, number], boolean>` is `[boolean, string, number]`

#### Scenario: Concat merges two tuple types preserving order
- **WHEN** the learner implements `Concat<A extends unknown[], B extends unknown[]>`
- **THEN** type assertions confirm correct results for various input lengths

### Requirement: k-026 covers variadic tuple patterns for function types
Koan 026 SHALL show how variadic tuples power advanced function types: capturing rest parameters, composing parameter lists, and implementing `curry`-style type signatures. The narrative SHALL explain `Parameters<T>` and how to extend it.

#### Scenario: DropFirst removes the first parameter from a function type
- **WHEN** the learner implements `DropFirst<F extends (...args: any[]) => any>`
- **THEN** type assertions confirm a 3-parameter function becomes a 2-parameter function type

#### Scenario: Variadic tuple captures and reconstructs parameter list
- **WHEN** the learner implements a `bind`-style type
- **THEN** type assertions confirm partial application produces the correct remaining parameter type

### Requirement: k-027 covers tuple to union and union to tuple conversions
Koan 027 SHALL cover `T[number]` to extract union from tuple, and the standard technique for converting union to tuple (with caveats about ordering non-determinism). The narrative SHALL be honest about the limitations of union-to-tuple.

#### Scenario: Tuple to union via indexed access
- **WHEN** the learner uses `T[number]` on a tuple type
- **THEN** type assertions confirm `["a", "b", "c"][number]` is `"a" | "b" | "c"`

#### Scenario: Union to tuple is possible but ordering is not guaranteed
- **WHEN** the learner implements `UnionToTuple<U>`
- **THEN** type assertions confirm the result contains exactly the right members (but the test does not assert order)
