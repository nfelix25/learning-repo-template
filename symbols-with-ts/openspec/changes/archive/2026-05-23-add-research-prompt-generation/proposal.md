## Why

The content-planner bulk planning pass (step 7 of the bootstrap flow) queues `audio_value: high` lessons without generating their deep-research prompts — that step is deferred to a dedicated skill. This change adds the `research-prompt-generator` skill so the bulk planning pass can fully complete all research artifacts before repo scaffolding begins.

## What Changes

- Add `research-prompt-generator` SKILL.md for Claude Code (`.claude/skills/research-prompt-generator/SKILL.md`)
- Add `research-prompt-generator` SKILL.md for Codex (`.codex/skills/research-prompt-generator/SKILL.md`)

## Capabilities

### New Capabilities

- `research-prompt-generator`: Skill called by content-planner for each `audio_value: high` lesson; generates `research-prompts/{lesson-id}.md` with a narrative-leaning deep-research prompt referencing the lesson's sources manifest.

### Modified Capabilities

## Impact

- Fills the `.gitkeep` placeholder in `.claude/skills/research-prompt-generator/` and `.codex/skills/research-prompt-generator/`
- No changes to existing skills, specs, or OpenSpec configuration
- Unlocks content-planner's ability to fully delegate research-prompt generation
