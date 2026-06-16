## Purpose

Define the approved-syllabus bulk planning flow, including content-planner orchestration and source-fetcher behavior for versioned and frontier lessons before repository scaffolding.

## Requirements

### Requirement: Peer Content Planner Skill Files Exist
The repository SHALL provide equivalent `content-planner` skill definitions for Codex and Claude Code.

#### Scenario: Content Planner Skill Is Located
- **WHEN** a contributor inspects `.codex/skills/content-planner/` and `.claude/skills/content-planner/`
- **THEN** each directory contains a real `SKILL.md` for the content-planner skill.

### Requirement: Peer Source Fetcher Skill Files Exist
The repository SHALL provide equivalent `source-fetcher` skill definitions for Codex and Claude Code.

#### Scenario: Source Fetcher Skill Is Located
- **WHEN** a contributor inspects `.codex/skills/source-fetcher/` and `.claude/skills/source-fetcher/`
- **THEN** each directory contains a real `SKILL.md` for the source-fetcher skill.

### Requirement: Content Planner Accepts Approved Syllabus
The content-planner skill SHALL start from an approved syllabus and refuse to redo topic scoping or shape selection.

#### Scenario: Approved Syllabus Is Provided
- **WHEN** the skill receives approved syllabus YAML from the start-learning flow
- **THEN** it begins planning per-lesson manifests without asking the start-learning scoping questions again.

### Requirement: Content Planner Emits Per-Lesson Manifests
The content-planner skill SHALL populate each lesson with an outline and source information while preserving the syllabus metadata.

#### Scenario: Lesson Manifest Is Planned
- **WHEN** the skill plans a lesson from the approved syllabus
- **THEN** the output preserves `id`, `depends_on`, `type`, `currency`, `audio_value`, `estimated_minutes`, `concepts`, optional `framing_notes`, and optional `build_piece_role`, and adds `outline` and `sources` planning fields.

### Requirement: Content Planner Drafts Standard Outline Sections
The content-planner skill SHALL draft outline sections for intro, mechanic, worked example, pitfalls, and exercise setup for every lesson.

#### Scenario: Lesson Outline Is Drafted
- **WHEN** the skill creates a lesson outline
- **THEN** the outline includes intro, mechanic, worked example, pitfalls, and exercise setup sections.

### Requirement: Content Planner Uses Source Fetcher For Versioned And Frontier Lessons
The content-planner skill SHALL call `source-fetcher` for every lesson marked `versioned` or `frontier`.

#### Scenario: Source-Checked Lesson Is Planned
- **WHEN** a lesson has `currency: versioned` or `currency: frontier`
- **THEN** the content-planner passes the lesson topic, concepts, currency, and relevant syllabus context to `source-fetcher`.

### Requirement: Stable Lessons Avoid Active Fetching
The content-planner skill SHALL NOT require active source fetching for lessons marked `stable`.

#### Scenario: Stable Lesson Is Planned
- **WHEN** a lesson has `currency: stable`
- **THEN** the skill may list cross-reference sources but does not require source-fetcher verification.

### Requirement: Source Fetcher Applies Source Hierarchy
The source-fetcher skill SHALL gather sources using the approved hierarchy: official documentation, specifications, release notes or maintainer posts, then high-signal named-expert sources.

#### Scenario: Sources Are Gathered
- **WHEN** source-fetcher gathers sources for a versioned or frontier lesson
- **THEN** it prioritizes official documentation before specs, maintainer material, or named-expert community sources.

### Requirement: Source Fetcher Rejects Weak Sources
The source-fetcher skill SHALL reject aggregators, tutorial farms, AI-generated content sites, and anonymous tutorial sources as primary sources.

#### Scenario: Weak Source Is Encountered
- **WHEN** a candidate source is an aggregator, tutorial farm, AI-generated content site, or anonymous tutorial
- **THEN** source-fetcher excludes it from primary sources.

### Requirement: Source Fetcher Records Verification Metadata
The source-fetcher skill SHALL record source role, fetched date, version checked when applicable, and notes about conflicts or source quality.

#### Scenario: Versioned Sources Are Returned
- **WHEN** source-fetcher returns sources for a versioned lesson
- **THEN** each source includes URL, role, fetched date, and any relevant version or conflict notes.

### Requirement: Content Planner Queues High-Audio Lessons Without Generating Prompts
The content-planner skill SHALL identify `audio_value: high` lessons as later research-prompt candidates without generating research prompts.

#### Scenario: High Audio Lesson Is Planned
- **WHEN** a lesson has `audio_value: high`
- **THEN** the digest marks it as queued for the future `research-prompt-generator` step without creating prompt content.

### Requirement: Content Planner Produces Digest For Review
The content-planner skill SHALL assemble a digest for human review after planning all lessons.

#### Scenario: Planning Completes
- **WHEN** all lesson manifests are planned
- **THEN** the skill presents a digest with one row per lesson showing lesson id, concepts, currency, audio value, source count, and outline summary.

### Requirement: Content Planner Stops Without Writing Files
The content-planner skill SHALL stop at digest review without writing repository files or creating lesson OpenSpec changes.

#### Scenario: Digest Is Presented
- **WHEN** the planning digest is ready for review
- **THEN** the skill asks for review or approval and does not write manifests, sources files, research prompts, scaffold files, or OpenSpec lesson changes.

### Requirement: Canonical Content Planning Fixture Exists
The repository SHALL include a TS-generics content-planning fixture that captures the canonical source-fetching, outline, high-audio queue, and digest markers.

#### Scenario: Fixture Is Reviewed
- **WHEN** a contributor validates the content-planning flow
- **THEN** they can compare the flow against the TS-generics content-planning fixture.

### Requirement: Verification Covers Content Planning Artifacts
The repository SHALL include verification that checks content-planner and source-fetcher skill artifacts and fixture markers are present.

#### Scenario: Verification Runs
- **WHEN** repository verification is run
- **THEN** it checks that the content-planning skill files exist and preserve core planning and source-fetching guardrails.
