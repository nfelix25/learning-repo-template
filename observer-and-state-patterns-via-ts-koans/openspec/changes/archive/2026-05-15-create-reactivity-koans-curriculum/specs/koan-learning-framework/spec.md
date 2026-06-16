## ADDED Requirements

### Requirement: TypeScript koan project structure
The repository SHALL provide a TypeScript-first koan project structure that separates implementation modules, ordered koan tests, and learner notes.

#### Scenario: Project structure is present
- **WHEN** the repository baseline is implemented
- **THEN** it MUST include `src/` for from-scratch implementations, `koans/` for ordered behavior tests, and `notes/` for learner explanations

#### Scenario: Sections are discoverable
- **WHEN** a learner inspects the koan directories
- **THEN** each section MUST be ordered so the learning path progresses from observer basics through observable, state, signal/reactivity, and comparison topics

### Requirement: Koans run as tests
The repository SHALL use executable tests as the koan interface so learners receive immediate feedback while implementing each primitive.

#### Scenario: Learner runs all koans
- **WHEN** a learner runs the documented koan test command
- **THEN** the test runner MUST execute the ordered koan files and report passing and failing koans

#### Scenario: Learner works one section
- **WHEN** a learner runs the documented command for a single section
- **THEN** the test runner MUST execute only the koans for that section

### Requirement: Build-break-refine progression
Each major learning section SHALL force the learner to build an initial primitive, observe a targeted failure mode, and refine the implementation to satisfy a stronger invariant.

#### Scenario: Section includes refinement koans
- **WHEN** a section introduces a new pattern primitive
- **THEN** the section MUST include at least one later koan that exposes a limitation of the initial implementation

#### Scenario: Failure mode is named
- **WHEN** a koan exists to expose a limitation
- **THEN** the koan or its paired note MUST name the failure mode or invariant being taught

### Requirement: Learner notes explain after behavior
The repository SHALL provide concise learner notes that explain each major concept after the corresponding koans make the behavior visible.

#### Scenario: Notes map to sections
- **WHEN** a learner completes or inspects a koan section
- **THEN** the repository MUST provide a corresponding note that explains the pattern, its invariant, and intentional simplifications

#### Scenario: Notes avoid library instruction
- **WHEN** a note compares the concept to known ecosystems
- **THEN** it MUST explain the underlying pattern without teaching real-world library APIs

### Requirement: From-scratch implementation boundary
The repository SHALL keep all observer, observable, state, signal, and reactive graph implementations local and from scratch.

#### Scenario: Pattern library dependency is proposed
- **WHEN** implementation requires observer, observable, state, signal, or state machine behavior
- **THEN** the repository MUST implement that behavior in local TypeScript modules rather than importing a production pattern library

#### Scenario: Development tooling is needed
- **WHEN** the project needs tooling for TypeScript, tests, formatting, or linting
- **THEN** dev dependencies MAY be added only to support the learning workflow and MUST NOT become the subject of the koans
