## Purpose

Define the research-prompt-generator skill that produces audio-suitable deep-research prompts for `audio_value: high` lessons during the bulk planning pass.

## Requirements

### Requirement: Peer Skill Files Exist
The repository SHALL provide equivalent `research-prompt-generator` skill definitions for Codex and Claude Code.

#### Scenario: Skill Is Located
- **WHEN** a contributor inspects `.codex/skills/research-prompt-generator/` and `.claude/skills/research-prompt-generator/`
- **THEN** each directory contains a real `SKILL.md` for the research-prompt-generator skill (not just a `.gitkeep`).

### Requirement: Skill Accepts Lesson Manifest Inputs
The research-prompt-generator skill SHALL accept a lesson manifest containing lesson ID, concepts list, sources list, and optional framing notes as its primary inputs.

#### Scenario: Lesson Manifest Is Provided
- **WHEN** the skill receives a lesson manifest with `id`, `concepts`, and `sources`
- **THEN** it generates a research prompt without asking for topic scoping or shape information already captured in the manifest.

### Requirement: Skill Generates Document Matching Research-Prompt Schema
The research-prompt-generator skill SHALL produce a research-prompt document that includes a target tool declaration, intended use, lesson reference, a 2–4 paragraph prompt body, and a source priority list.

#### Scenario: Document Is Generated
- **WHEN** the skill generates a research prompt for a lesson
- **THEN** the output includes "Target tool", "Intended use", "Lesson" reference, a "Prompt" section (2–4 paragraphs), and a "Source priority" list matching the format defined in HANDOFF.md §5.6.

### Requirement: Prompt Biases Toward Audio-Suitable Content
The research-prompt-generator skill SHALL produce prompt text that biases toward narrative, motivation, conceptual comparison, and design tradeoff angles rather than syntax mechanics.

#### Scenario: Prompt Is Audio-Suitable
- **WHEN** the skill writes the prompt body
- **THEN** the instructions direct the research tool toward conceptual explanation, motivational framing, and design rationale — not step-by-step syntax or code walkthroughs.

### Requirement: Prompt References Lesson Sources
The research-prompt-generator skill SHALL include all sources from the lesson manifest in the "Source priority" section of the output document.

#### Scenario: Sources Are Included
- **WHEN** the lesson manifest contains a `sources` list
- **THEN** the output document's "Source priority" section lists every source URL from that manifest.

### Requirement: Skill Does Not Write Files
The research-prompt-generator skill SHALL return the prompt document as in-memory content for review and SHALL NOT write files to `research-prompts/` or any other path.

#### Scenario: Skill Returns Content Without Writing
- **WHEN** the skill completes prompt generation
- **THEN** it outputs the document text to the conversation and does not create or modify any files on disk.

### Requirement: Skill Anchors Prompt To Lesson Concepts
The research-prompt-generator skill SHALL scope each research prompt to the specific concepts listed in the lesson manifest, not to the broader topic.

#### Scenario: Prompt Is Lesson-Scoped
- **WHEN** a lesson covers a subset of a broader topic
- **THEN** the prompt body focuses on the lesson's `concepts` list rather than surveying the full topic.
