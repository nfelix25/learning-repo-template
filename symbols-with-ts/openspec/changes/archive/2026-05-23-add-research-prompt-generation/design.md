## Context

The bootstrap flow's bulk planning pass (step 7) is responsible for generating deep-research prompts for every `audio_value: high` lesson. The content-planner skill currently identifies these lessons and queues them explicitly without generating prompts, deferring to a `research-prompt-generator` skill that does not yet exist. This design adds that skill to close the gap.

The existing `content-planner` skill and the `start-learning` flow orchestration are both aware of this deferral — the content-planner's guardrails explicitly say "Do not generate research prompts; only queue `audio_value: high` lessons for the future `research-prompt-generator`." No changes to those skills are required by this change.

Skill directories `.claude/skills/research-prompt-generator/` and `.codex/skills/research-prompt-generator/` already exist with `.gitkeep` placeholders.

## Goals / Non-Goals

**Goals:**
- Define the `research-prompt-generator` skill behavior and interface
- Fill the `.gitkeep` placeholders with real SKILL.md files for both Claude Code and Codex
- Produce prompts that are audio-suitable (narrative, motivational, design-tradeoff-focused)

**Non-Goals:**
- Writing `research-prompts/` files to disk (repo-scaffold handles that in step 9)
- Modifying `content-planner`, `start-learning`, or `repo-scaffold`
- Fetching sources (sources arrive as inputs from the lesson manifest)

## Decisions

### Skill produces in-memory prompt document, not a file

The no-file-writes rule applies through step 8 (digest review). The skill returns prompt content matching the §5.6 schema for caller review; the actual `research-prompts/{lesson-id}.md` file is written by `repo-scaffold` in step 9.

*Alternative considered*: Have the skill write directly to `research-prompts/`. Rejected — this would violate the no-file-writes principle and make the bulk planning pass harder to revise or discard.

### Skill is a standalone unit, not embedded in content-planner

The skill is invoked by whoever is orchestrating step 7 (typically `start-learning` or the user directly). Content-planner queues high-audio lessons; research-prompt-generator processes them. This preserves single-responsibility and allows the skill to be used outside the full bootstrap flow.

*Alternative considered*: Embed prompt generation directly in content-planner. Rejected — content-planner's guardrails already explicitly exclude this, and keeping concerns separated makes each skill easier to reason about independently.

### Prompt angle: conceptual/motivational, not syntactic

Research prompts target Gemini Deep Research or comparable tools, and the output feeds NotebookLM for audio consumption. Syntax-heavy content does not translate well to audio. The skill's output must bias toward narrative, motivation, comparison, and design tradeoffs.

## Risks / Trade-offs

- **Source list accuracy** → Prompts reference sources from the lesson manifest; if sources are incomplete or stale the prompt quality degrades. Mitigation: skill should note when the source list is sparse and recommend the user verify before using the prompt.
- **Prompt scope creep** → Audio-suitable prompts can drift toward survey-level coverage rather than lesson-scoped coverage. Mitigation: skill instructions explicitly anchor the prompt to the lesson's `concepts` list.
