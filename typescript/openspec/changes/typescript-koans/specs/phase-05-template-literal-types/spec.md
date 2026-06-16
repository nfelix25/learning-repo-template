## ADDED Requirements

### Requirement: k-020 introduces template literal type syntax
Koan 020 SHALL cover `` `${A}${B}` `` type construction, distribution over union members, and simple string type composition patterns like `EventName<T>` or CSS property names.

#### Scenario: Template literal distributes over string unions
- **WHEN** the learner writes `` type Events<T extends string> = `${T}Changed` ``
- **THEN** type assertions confirm `Events<"name" | "age">` is `"nameChanged" | "ageChanged"`

#### Scenario: Template literal composes multiple union dimensions
- **WHEN** the learner writes a type crossing two string unions
- **THEN** type assertions confirm all combinations appear in the result

### Requirement: k-021 covers intrinsic string manipulation types
Koan 021 SHALL cover the four built-in string utility types: `Uppercase<S>`, `Lowercase<S>`, `Capitalize<S>`, `Uncapitalize<S>`. The narrative SHALL explain these are compiler intrinsics, not implementable in user space.

#### Scenario: Capitalize produces correct case transformation
- **WHEN** the learner uses `Capitalize` in a type
- **THEN** type assertions confirm `"hello"` → `"Hello"` and `"hELLO"` → `"HELLO"` (only first char)

#### Scenario: Learner builds a camelCase converter type
- **WHEN** the learner implements `CamelCase<S>` using intrinsics and template literals
- **THEN** type assertions confirm `"hello-world"` → `"helloWorld"`

### Requirement: k-022 combines template literal types with mapped types
Koan 022 SHALL build on Phase 3 mapped types to create event-handler objects, getter/setter pairs, and CSS property maps using the `as` key remapping syntax with template literals. This is the synthesis koan for Phases 3–5.

#### Scenario: Mapped type generates getter methods from data shape
- **WHEN** the learner implements `Getters<T>` that maps `{ name: string }` to `{ getName: () => string }`
- **THEN** type assertions confirm the structure for multi-property input types

#### Scenario: Mapped type generates on-event handlers
- **WHEN** the learner implements an event-handler type from a union of event names
- **THEN** type assertions confirm `on${Capitalize<Event>}` key names with `() => void` values

### Requirement: k-023 covers template literal pattern matching with infer
Koan 023 SHALL combine template literals with `infer` to extract parts of string literal types. The narrative SHALL note that this is the type-level equivalent of a regex match group.

#### Scenario: Learner extracts prefix from a string literal type
- **WHEN** the learner implements `ExtractPrefix<S, Sep>` using `infer` inside a template literal conditional
- **THEN** type assertions confirm `ExtractPrefix<"hello.world", ".">` is `"hello"`

#### Scenario: Learner splits a path string type into tuple
- **WHEN** the learner implements `SplitPath<S>` recursively
- **THEN** type assertions confirm `SplitPath<"a/b/c">` is `["a", "b", "c"]`
