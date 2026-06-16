## Purpose

Define the start-learning entry-point skill that scopes a topic seed, chooses the learning-project shape, delegates syllabus drafting, and stops at syllabus approval without writing files.

## Requirements

### Requirement: Peer Start Learning Skill Files Exist
The repository SHALL provide equivalent `start-learning` skill definitions for Codex and Claude Code.

#### Scenario: Skill Is Located
- **WHEN** a contributor inspects `.codex/skills/start-learning/` and `.claude/skills/start-learning/`
- **THEN** each directory contains a real `SKILL.md` for the start-learning skill.

### Requirement: Skill Starts From Topic Seed
The start-learning skill SHALL accept a topic seed from the user and confirm the topic before scoping.

#### Scenario: Topic Is Provided
- **WHEN** the user starts `/start-learning TypeScript generics`
- **THEN** the skill confirms the topic and begins the scoping flow for that topic.

### Requirement: Skill Runs Bounded Scoping Conversation
The start-learning skill SHALL ask 3-4 high-signal scoping questions covering goal, baseline, scope boundary, and optional time/depth or framing.

#### Scenario: Scoping Begins
- **WHEN** the skill needs learning-project context
- **THEN** it asks no more than four scoping questions before proposing a shape decision.

### Requirement: Skill Proposes Shape With Reasoning
The start-learning skill SHALL apply the shape-decision rubric and present a reasoned recommendation for `koan`, `build`, or `hybrid`.

#### Scenario: Shape Is Proposed
- **WHEN** scoping answers are available
- **THEN** the skill recommends a shape with reasoning and allows the user to override it.

### Requirement: Skill Presents Build Piece Options When Needed
The start-learning skill SHALL present 3-5 build-piece options with tradeoffs when the selected shape is `build` or `hybrid`.

#### Scenario: Build Piece Is Needed
- **WHEN** the selected shape requires a build piece
- **THEN** the skill lists build-piece candidates, explains what each exercises, names its pick, and allows the user to choose another option.

### Requirement: Skill Delegates Syllabus Drafting
The start-learning skill SHALL pass completed scoping inputs, shape decision, selected build piece, and optional framing/lens to `curriculum-design` for syllabus drafting.

#### Scenario: Syllabus Draft Is Needed
- **WHEN** scoping and shape decisions are complete
- **THEN** the skill uses the curriculum-design behavior to produce syllabus YAML rather than inventing a separate schema.

### Requirement: Skill Offers Connected Extensions
After the syllabus draft, the start-learning skill SHALL offer 3-5 adjacent topics that are plausibly in scope but omitted.

#### Scenario: Syllabus Draft Is Presented
- **WHEN** the draft syllabus is ready
- **THEN** the skill presents possible additions with where each would slot into the syllabus.

### Requirement: Skill Stops At Approval Without Writing Files
The start-learning skill SHALL treat the syllabus as a draft, iterate on user feedback, and stop at approval without writing repository files.

#### Scenario: Syllabus Is Approved
- **WHEN** the user approves the syllabus
- **THEN** the skill summarizes the approved syllabus and indicates that `content-planner` is the concrete later next step without writing files.

### Requirement: Canonical Start Learning Fixture Exists
The repository SHALL include a TS-generics start-learning fixture that captures the canonical scoping, shape, build-piece, and extension-flow markers.

#### Scenario: Fixture Is Reviewed
- **WHEN** a contributor validates the start-learning skill
- **THEN** they can compare the flow against the TS-generics start-learning fixture.

### Requirement: Verification Covers Start Learning Artifacts
The repository SHALL include verification that checks the start-learning skill artifacts and fixture markers are present.

#### Scenario: Verification Runs
- **WHEN** repository verification is run
- **THEN** it checks that both start-learning skill files exist and preserve core flow guardrails.
