## Purpose

Define the end-to-end bootstrap dry-run fixture for the TypeScript "Symbols, Iterators, Iterables, Streams, and Cleanup" topic. Validates that the full skill chain composes correctly and the generated structure matches the §4 repo shape and §5.4 lesson templates.

## Requirements

### Requirement: Start Learning Fixture Exists
The repository SHALL include a `fixtures/ts-symbols-iterators/start-learning.md` that captures the scoping answers, shape decision, and build-piece selection for the TypeScript Symbols/Iterators topic.

#### Scenario: Start Learning Fixture Is Located
- **WHEN** a contributor inspects `fixtures/ts-symbols-iterators/start-learning.md`
- **THEN** the file exists and contains topic confirmation, scoping answers (goal, baseline, scope boundary), shape decision (hybrid), and the selected build piece with reasoning.

### Requirement: Syllabus Fixture Exists
The repository SHALL include a `fixtures/ts-symbols-iterators/syllabus.yaml` containing the approved curriculum-design output for the TypeScript Symbols/Iterators topic.

#### Scenario: Syllabus Fixture Is Located
- **WHEN** a contributor inspects `fixtures/ts-symbols-iterators/syllabus.yaml`
- **THEN** the file exists and contains a valid lesson list where every lesson has `id`, `type`, `currency`, `audio_value`, `estimated_minutes`, and `concepts` fields.

### Requirement: Syllabus Covers Full Topic Surface
The syllabus fixture SHALL include lessons that cover Symbol well-known symbols, the iterator and iterable protocols, generator functions, async iterators, async generators, and resource cleanup patterns.

#### Scenario: Core Concepts Are Present
- **WHEN** a contributor reviews the lesson `concepts` across the syllabus
- **THEN** Symbol, iterator protocol, iterable protocol, generator syntax, async iterator, async generator, and cleanup/finalization are each covered by at least one lesson.

### Requirement: Syllabus Uses Hybrid Shape With Build Piece
The syllabus fixture SHALL use `shape: hybrid` with a build-piece component that exercises async iteration and cleanup behavior.

#### Scenario: Shape Is Hybrid
- **WHEN** a contributor inspects the syllabus fixture
- **THEN** some lessons have `type: koan` and at least one lesson has `type: build_piece`, and the build-piece lesson(s) appear after the koan foundation lessons that establish the required concepts.

### Requirement: Content Plan Fixture Exists
The repository SHALL include a `fixtures/ts-symbols-iterators/content-plan.md` capturing the content-planner output with per-lesson outline and source planning for the TypeScript Symbols/Iterators topic.

#### Scenario: Content Plan Fixture Is Located
- **WHEN** a contributor inspects `fixtures/ts-symbols-iterators/content-plan.md`
- **THEN** the file exists and contains per-lesson manifests that preserve all syllabus metadata and add `outline` and `sources` fields for each lesson.

### Requirement: Research Prompts Fixture Exists For High-Audio Lessons
The repository SHALL include `fixtures/ts-symbols-iterators/research-prompts/{lesson-id}.md` for every lesson in the syllabus with `audio_value: high`.

#### Scenario: Research Prompt Fixture Is Located
- **WHEN** a contributor inspects `fixtures/ts-symbols-iterators/research-prompts/`
- **THEN** at least one `.md` file exists, and each matches the §5.6 research-prompt schema with a target tool declaration, prompt body (2–4 paragraphs), and source priority list.

### Requirement: Scaffold Fixture Matches Expected Repo Structure
The repository SHALL include `fixtures/ts-symbols-iterators/scaffold/` containing the repo-scaffold output matching the §4 repo structure.

#### Scenario: Scaffold Fixture Is Located
- **WHEN** a contributor inspects `fixtures/ts-symbols-iterators/scaffold/`
- **THEN** the directory contains `LEARNING.md`, `STYLE.md`, `openspec/project.md`, `openspec/AGENTS.md`, and `openspec/changes/` with at least one lesson change directory.

### Requirement: Scaffold Uses Correct Lesson Templates
The scaffold fixture SHALL apply Template A for stable koan lessons, Template B for versioned/frontier koan lessons, and Template C for build-piece lessons.

#### Scenario: Template A Is Used For Stable Koans
- **WHEN** a contributor inspects a stable koan lesson's change directory in the scaffold fixture
- **THEN** it contains `proposal.md` and `tasks.md` and does NOT contain `design.md`.

#### Scenario: Template B Is Used For Versioned Koans
- **WHEN** a contributor inspects a versioned or frontier koan lesson's change directory in the scaffold fixture
- **THEN** it contains `proposal.md`, `design.md`, `tasks.md`, and `sources.md`.

#### Scenario: Template C Is Used For Build-Piece Lessons
- **WHEN** a contributor inspects a build-piece lesson's change directory in the scaffold fixture
- **THEN** it contains `proposal.md`, `design.md`, a `specs/` delta, and `tasks.md`.

### Requirement: README Build Status Is Updated
The repository's `README.md` SHALL list `bootstrap-first-real-topic` under Completed in the Build Status section.

#### Scenario: README Is Updated
- **WHEN** a contributor reads `README.md`
- **THEN** `bootstrap-first-real-topic` appears under "Completed" and not under "Active" or the roadmap items.
