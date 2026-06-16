## ADDED Requirements

### Requirement: Repository Documents Explain Purpose And Roadmap
The repository SHALL include root documentation that explains the learning-template purpose, identifies `HANDOFF.md` as the detailed design source, and lists the planned OpenSpec change sequence.

#### Scenario: Contributor Opens Repository
- **WHEN** a contributor reads the root documentation
- **THEN** they can identify the template goal, the current skeleton milestone, and the next planned changes without reading every OpenSpec artifact.

### Requirement: TypeScript Vitest Baseline Exists
The repository SHALL include a TypeScript and Vitest baseline with strict TypeScript checking and package scripts for verification.

#### Scenario: Project Baseline Is Inspected
- **WHEN** a contributor inspects the root project configuration
- **THEN** they find `package.json`, `tsconfig.json`, and `vitest.config.ts` configured for TypeScript, Vitest, strict mode, and `noUncheckedIndexedAccess`.

### Requirement: Type Level Testing Uses Vitest
The repository SHALL document Vitest `expectTypeOf` as the type-level testing convention and SHALL NOT introduce `tsd` as a dependency or required workflow.

#### Scenario: Type Test Convention Is Needed
- **WHEN** a future skill or lesson needs type-level assertions
- **THEN** the documented convention directs authors to use Vitest `expectTypeOf` rather than `tsd`.

### Requirement: Style Defaults Are Captured
The repository SHALL include `STYLE.md` with initial conventions for test framework usage, koan style, content style, and TypeScript compiler expectations.

#### Scenario: Style Guidance Is Needed
- **WHEN** a future learning-template skill needs default style guidance
- **THEN** `STYLE.md` provides the initial conventions that the skill can reference or refine.

### Requirement: Agent Skill Compatibility Layout Is Reserved
The repository SHALL reserve trackable placeholder locations for future learning-template skills under both `.codex/skills/` and `.claude/skills/`.

#### Scenario: Future Skill Work Starts
- **WHEN** a future change begins implementing a learning-template skill
- **THEN** matching Codex and Claude Code skill locations already exist for that skill name.

### Requirement: Existing OpenSpec Workflow Support Is Preserved
The skeleton change SHALL NOT remove or replace existing OpenSpec workflow commands, skills, or configuration.

#### Scenario: Existing Workflow Is Used After Skeleton
- **WHEN** a contributor runs the existing OpenSpec helper workflow after this change
- **THEN** the previously available OpenSpec commands, skills, and `openspec/config.yaml` remain present.
