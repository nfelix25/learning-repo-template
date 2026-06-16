## ADDED Requirements

### Requirement: Guided lesson map
The repository SHALL provide a top-level lesson map that connects README guidance, section notes, koan files, and source files into a coherent learning path.

#### Scenario: Learner finds the next file to read
- **WHEN** a learner opens the lesson map
- **THEN** it MUST show the ordered path from each section note to its koan files and related source files

#### Scenario: Lesson map explains file roles
- **WHEN** the lesson map references README, notes, koans, and source files
- **THEN** it MUST explain how each layer contributes to the learning workflow

### Requirement: README study workflow
The README SHALL explain how to study the repository as guided text embedded in executable lessons.

#### Scenario: Learner reads README before running koans
- **WHEN** a learner reads the README
- **THEN** it MUST explain the read-predict-run-inspect-repair-reflect workflow

#### Scenario: Learner expects intentional failures
- **WHEN** a learner reads the README
- **THEN** it MUST clarify that some failing koans are intentional prompts to inspect and refine starter implementations

### Requirement: Koan instructional comments
Every koan file SHALL include instructional comments that guide the learner through the concept being tested.

#### Scenario: Koan file starts with a lesson frame
- **WHEN** a learner opens a koan file
- **THEN** the file MUST identify the concept, relevant source files, and the invariant or failure mode being explored

#### Scenario: Koan prompts prediction
- **WHEN** a learner reads an individual test
- **THEN** nearby comments MUST encourage prediction of behavior before reading or running the assertion

### Requirement: Source teaching comments
Source files SHALL include teaching comments at primitive boundaries and repair sites.

#### Scenario: Learner reaches a TODO
- **WHEN** a learner inspects a TODO or intentionally naive implementation
- **THEN** nearby comments MUST explain what is naive, why it fails, and what invariant the learner is meant to protect

#### Scenario: Learner sees a core primitive boundary
- **WHEN** a source file defines a subscription, observer, observable, store, signal, computed value, effect, scheduler, or adapter boundary
- **THEN** comments MUST explain the role of that boundary in the pattern being taught

### Requirement: Thorough section lessons
Section notes SHALL be thorough standalone lessons rather than short summaries.

#### Scenario: Learner reads a section note
- **WHEN** a learner opens a section note
- **THEN** it MUST include vocabulary, mental model, build-break-refine sequence, failure modes, and reflection prompts

#### Scenario: Section note includes visual model
- **WHEN** a section includes nontrivial flow or graph behavior
- **THEN** its note MUST include an ASCII diagram or similarly explicit textual model

### Requirement: High-value comment density
The narrative layer SHALL prioritize high-value teaching comments over line-by-line syntax narration.

#### Scenario: Comment explains obvious syntax
- **WHEN** a comment only restates a simple statement or TypeScript syntax
- **THEN** it SHOULD be omitted or replaced with a comment about pattern pressure, invariant, or failure mode

#### Scenario: Comment explains learning pressure
- **WHEN** a comment explains why a naive implementation fails or why an invariant matters
- **THEN** it SHOULD remain close to the relevant test or source code
