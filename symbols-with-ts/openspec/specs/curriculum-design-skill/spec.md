## Purpose

Define the standalone curriculum-design skill that turns completed learning-project scoping inputs into a draft syllabus YAML.

## Requirements

### Requirement: Peer Skill Files Exist
The repository SHALL provide equivalent `curriculum-design` skill definitions for Codex and Claude Code.

#### Scenario: Skill Is Located
- **WHEN** a contributor inspects `.codex/skills/curriculum-design/` and `.claude/skills/curriculum-design/`
- **THEN** each directory contains a real `SKILL.md` for the curriculum-design skill.

### Requirement: Skill Accepts Completed Scoping Inputs
The curriculum-design skill SHALL require topic, scoping answers, shape decision, optional build piece, and optional framing/lens as inputs.

#### Scenario: Complete Inputs Are Provided
- **WHEN** the skill receives topic, goal, baseline, scope boundary, shape, and any build-piece or framing details
- **THEN** it can produce a syllabus draft without asking the start-learning scoping questions again.

### Requirement: Skill Emits Syllabus YAML
The curriculum-design skill SHALL output syllabus YAML matching the lesson manifest schema from `HANDOFF.md`.

#### Scenario: Syllabus Is Generated
- **WHEN** the skill drafts a syllabus
- **THEN** each lesson includes `id`, `depends_on`, `type`, `currency`, `audio_value`, `estimated_minutes`, and `concepts`, with optional `framing_notes` and `build_piece_role` only when applicable.

### Requirement: Skill Leaves Planning Fields Empty
The curriculum-design skill SHALL NOT populate lesson `sources` or `outline` fields.

#### Scenario: Content Planning Is Deferred
- **WHEN** the skill emits syllabus YAML
- **THEN** source lists and lesson outlines remain absent or explicitly deferred for the later content-planner flow.

### Requirement: Skill Applies Curriculum Heuristics
The curriculum-design skill SHALL apply the handoff heuristics for lesson count, stable IDs, dependency declarations, currency tagging, audio-value tagging, and hybrid phase ordering.

#### Scenario: Heuristics Shape The Syllabus
- **WHEN** a syllabus covers a topic with prerequisite relationships and mixed lesson types
- **THEN** lesson IDs are stable `NN-kebab-name` values, dependencies are explicit, currency/audio labels are assigned, and hybrid syllabi put koans before build-piece work unless a lesson is intentionally placed just-in-time.

### Requirement: Skill Preserves User Authority
The curriculum-design skill SHALL present the syllabus as a draft for review rather than treating it as final.

#### Scenario: Draft Is Returned
- **WHEN** the skill finishes syllabus generation
- **THEN** it invites user review or revision and does not write repository files.

### Requirement: Canonical TS Generics Fixture Exists
The repository SHALL include a TS-generics input fixture and expected syllabus fixture based on the canonical dry-run in `HANDOFF.md`.

#### Scenario: Fixture Is Reviewed
- **WHEN** a contributor validates the curriculum-design skill
- **THEN** they can compare the skill output against the TS-generics expected syllabus fixture.

### Requirement: Verification Covers Skill Artifacts
The repository SHALL include verification that checks the curriculum-design skill artifacts and canonical fixture are present.

#### Scenario: Verification Runs
- **WHEN** repository verification is run
- **THEN** it checks that both skill files exist and that the TS-generics fixture preserves key canonical syllabus markers.
