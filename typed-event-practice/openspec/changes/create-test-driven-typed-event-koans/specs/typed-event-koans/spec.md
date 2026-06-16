## ADDED Requirements

### Requirement: Test-driven koan workflow

The repository SHALL provide a TypeScript koans workflow where learners complete failing tests and type assertions to practice typed event patterns.

#### Scenario: Run runtime koans

- **WHEN** the learner runs the runtime test command
- **THEN** the system executes the koan test suite and reports failing or passing runtime assertions.

#### Scenario: Run compile-time koans

- **WHEN** the learner runs the type-check command
- **THEN** the system validates compile-time assertions and reports TypeScript errors, including unmet `@ts-expect-error` expectations.

### Requirement: Typed event curriculum

The repository SHALL include koans that cover typed event maps, typed emitter APIs, listener lifecycle behavior, inference, variance, derived event names, async delivery, and platform interop.

#### Scenario: Inspect koan sequence

- **WHEN** the learner reviews the koans directory
- **THEN** the system presents a numbered sequence that progresses from minimal typed event maps to broader event and communication patterns.

#### Scenario: Practice advanced TypeScript event patterns

- **WHEN** the learner completes the koans in order
- **THEN** the exercises expose TypeScript-specific event API techniques such as `keyof`, indexed access types, literal preservation, callback typing, template literal event names, and compile-time payload validation.

### Requirement: Short companion notes

The repository SHALL provide short notes for the koans that explain the concept under practice, the relevant TypeScript mechanism, and important design tradeoffs.

#### Scenario: Read koan note

- **WHEN** the learner opens the note for a koan
- **THEN** the note explains the learning objective without replacing the test-driven exercise.

### Requirement: Small learning-focused project shape

The repository SHALL stay scoped to a personal learning lab rather than a published event library or framework application.

#### Scenario: Review project scope

- **WHEN** the learner reviews the project structure and documentation
- **THEN** the system makes clear that the repo is for practicing typed event implementations and patterns from scratch-ish, not for producing a production package.
