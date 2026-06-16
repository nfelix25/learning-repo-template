## ADDED Requirements

### Requirement: Local TypeScript execution
The repository SHALL provide npm scripts that let a learner type-check and run koan tests locally.

#### Scenario: Learner installs dependencies
- **WHEN** the learner runs the documented install command
- **THEN** the repository has the dependencies needed to type-check and run TypeScript koans

#### Scenario: Learner runs all koans
- **WHEN** the learner runs the documented test command
- **THEN** all included koan tests execute through the configured TypeScript test runner

### Requirement: Focused koan test execution
The repository SHALL provide a documented way to run one koan or a narrowed set of koans during study.

#### Scenario: Learner works on one koan
- **WHEN** the learner runs the documented focused test command for a koan path
- **THEN** only the selected koan test file or matching test subset runs

### Requirement: Type-checking feedback
The repository MUST provide a type-check command that validates the TypeScript source without emitting build output.

#### Scenario: Learner checks static typing
- **WHEN** the learner runs the documented type-check command
- **THEN** TypeScript validates the project and does not create generated JavaScript files

### Requirement: Separate legacy compiler mode
The repository SHALL provide a separate TypeScript configuration or command path for legacy decorator exercises.

#### Scenario: Learner type-checks legacy koans
- **WHEN** the learner runs the documented legacy type-check command
- **THEN** TypeScript checks legacy koans with `experimentalDecorators` enabled

#### Scenario: Learner studies metadata emit
- **WHEN** a legacy metadata koan requires emitted decorator metadata
- **THEN** the legacy TypeScript configuration enables `emitDecoratorMetadata`

### Requirement: Solution isolation
Koan tests MUST import exercise implementations by default and MUST NOT depend on reference solution files to pass.

#### Scenario: Test imports are inspected
- **WHEN** a koan test file is reviewed
- **THEN** its runtime assertions import from `exercise.ts` rather than `solution.ts`

### Requirement: Repository usage documentation
The repository SHALL document the koan workflow, available npm scripts, directory structure, and the distinction between modern and legacy decorator sections.

#### Scenario: Learner opens the repository README
- **WHEN** the learner reads the setup instructions
- **THEN** they can identify how to install dependencies, run all tests, run one koan, type-check the project, and interpret modern versus legacy decorator sections
