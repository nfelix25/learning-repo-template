## ADDED Requirements

### Requirement: TypeScript project validation
The system SHALL provide a minimal TypeScript project configuration that validates koan files using the TypeScript compiler without emitting JavaScript.

#### Scenario: Run type-check command
- **WHEN** the learner runs the configured validation command
- **THEN** the command SHALL invoke TypeScript type checking with no JavaScript output

#### Scenario: Detect unfinished koans
- **WHEN** a koan contains an intentionally incorrect placeholder implementation
- **THEN** the compiler SHALL surface a type error through the assertion harness

### Requirement: Type assertion harness
The system SHALL provide shared type-level assertion helpers for expressing compile-time expectations.

#### Scenario: Assert equal types
- **WHEN** a koan compares an actual type implementation with the expected type using `Expect<Equal<Actual, Expected>>`
- **THEN** the assertion SHALL compile only when the compared types are equal

#### Scenario: Reuse assertions across koans
- **WHEN** a koan file needs type-level assertions
- **THEN** it SHALL import or otherwise reuse the shared assertion helpers rather than redefining them locally

### Requirement: Koan progression
The system SHALL organize exercises into a numbered progression that teaches TypeScript utility types by underlying type-system mechanism.

#### Scenario: Start with foundations
- **WHEN** the learner begins the workbook
- **THEN** the first koans SHALL introduce foundational mechanisms such as `keyof`, indexed access, mapped types, conditional types, and `infer`

#### Scenario: Advance through utility families
- **WHEN** the learner moves through the koan files in order
- **THEN** the progression SHALL cover object utilities, union utilities, function utilities, tuple utilities, string/template-literal utilities, recursive utilities, and professional edge-case patterns

### Requirement: Built-by-hand exercises
The system SHALL ask the learner to implement utility types manually instead of relying on TypeScript's built-in utility aliases for the exercise solution.

#### Scenario: Implement object utility
- **WHEN** a koan teaches an object utility such as `Pick`, `Omit`, `Partial`, `Required`, or `Readonly`
- **THEN** the exercise SHALL define a custom equivalent that the learner completes by hand

#### Scenario: Implement union utility
- **WHEN** a koan teaches a union utility such as `Exclude`, `Extract`, or `NonNullable`
- **THEN** the exercise SHALL require the learner to use conditional type behavior rather than delegating to the built-in utility

### Requirement: Embedded learning material
The system SHALL include concise learning comments inside koan files that explain the professional mental model for each exercise.

#### Scenario: Explain the concept near the exercise
- **WHEN** a koan introduces a new type-system mechanism
- **THEN** nearby comments SHALL describe the goal, relevant mental model, and at least one common trap or edge case

#### Scenario: Keep comments exercise-focused
- **WHEN** comments explain a koan
- **THEN** they SHALL support solving the local exercise without becoming a separate long-form tutorial

### Requirement: Professional TypeScript coverage
The system SHALL include exercises that cover edge cases and patterns relevant to professional TypeScript development.

#### Scenario: Cover sharp type-system edges
- **WHEN** the learner reaches advanced koans
- **THEN** exercises SHALL address topics such as `any` vs `unknown` vs `never`, distributive conditional types, disabling distribution, optional property detection, modifier preservation, union-to-intersection conversion, overload limitations, and recursion limits

#### Scenario: Include stretch cases
- **WHEN** a koan has a basic implementation path
- **THEN** it SHALL include additional cases that expose subtle behavior or common production mistakes

### Requirement: Personal workbook scope
The system SHALL optimize for a single experienced TypeScript learner rather than a beginner audience or public package consumers.

#### Scenario: Avoid application concerns
- **WHEN** the repo is scaffolded
- **THEN** it SHALL avoid runtime app code, browser UI, package publishing setup, and unrelated framework dependencies

#### Scenario: Use professional shorthand
- **WHEN** comments explain TypeScript concepts
- **THEN** they SHALL assume the learner is comfortable with TypeScript syntax and focus on deeper type-level reasoning
