## ADDED Requirements

### Requirement: Modern-first decorator progression
The curriculum SHALL teach modern standard TypeScript decorators before introducing legacy experimental decorators.

#### Scenario: Learner starts the curriculum
- **WHEN** a learner follows the koans in numeric order
- **THEN** the first decorator exercises use modern value/context decorator signatures

#### Scenario: Learner reaches legacy content
- **WHEN** a learner reaches legacy decorator koans
- **THEN** the curriculum explains that legacy decorators use a different TypeScript compiler mode and function signature model

### Requirement: Decorator topic coverage
The curriculum SHALL include koans covering decorator runtime timing, application order, decorator factories, class decorators, method decorators, field decorators, accessor decorators, initializer behavior, typing patterns, metadata, and legacy decorator ecosystem patterns.

#### Scenario: Curriculum is reviewed for coverage
- **WHEN** the list of koans is inspected
- **THEN** each required topic has at least one corresponding koan or documented planned koan

### Requirement: Koan learning unit structure
Each koan MUST use a consistent learning unit structure containing a short explanation, an exercise implementation, a focused test, a reference solution, and learner notes.

#### Scenario: New koan is added
- **WHEN** a koan directory is created
- **THEN** it contains `README.md`, `exercise.ts`, `exercise.test.ts`, `solution.ts`, and `notes.md`

### Requirement: Executable conceptual feedback
Each koan SHALL require the learner to verify decorator behavior through executable assertions rather than only reading prose.

#### Scenario: Learner works through a koan
- **WHEN** the learner runs the koan test before completing the exercise
- **THEN** the test identifies a specific failed expectation or incomplete implementation

#### Scenario: Learner completes a koan
- **WHEN** the learner has corrected the exercise implementation
- **THEN** the koan test passes without importing from `solution.ts`

### Requirement: Explicit modern and legacy boundary
The curriculum MUST clearly separate modern decorators from legacy experimental decorators in naming, documentation, and compiler configuration references.

#### Scenario: Learner opens a legacy koan
- **WHEN** a koan depends on `experimentalDecorators` or `emitDecoratorMetadata`
- **THEN** the koan documentation labels it as legacy and references the legacy TypeScript configuration

#### Scenario: Learner opens a modern koan
- **WHEN** a koan uses standard TypeScript decorator syntax
- **THEN** the koan documentation does not instruct the learner to enable `experimentalDecorators`

### Requirement: Reflection notes
Each koan SHALL include a notes file that prompts the learner to summarize the observed runtime behavior and any type-system boundary revealed by the exercise.

#### Scenario: Learner finishes a koan
- **WHEN** the learner opens the koan notes file
- **THEN** the file prompts for what ran at decoration time, what ran at instance time, and what TypeScript did or did not prove statically
