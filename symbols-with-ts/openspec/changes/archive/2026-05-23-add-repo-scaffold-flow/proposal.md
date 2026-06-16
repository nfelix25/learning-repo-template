## Why

The bootstrap flow's final step (step 9) requires a `repo-scaffold` skill that takes all the in-memory content from the planning phases and writes it to disk — producing a ready-to-execute learning project. Without this skill, the flow has no way to materialize the approved syllabus and per-lesson manifests into a repository.

## What Changes

- Add `repo-scaffold` SKILL.md for Claude Code (`.claude/skills/repo-scaffold/SKILL.md`)
- Add `repo-scaffold` SKILL.md for Codex (`.codex/skills/repo-scaffold/SKILL.md`)
- Remove `.gitkeep` placeholders from both directories

## Capabilities

### New Capabilities

- `repo-scaffold`: Skill triggered by `start-learning` after digest review; takes the approved syllabus and all per-lesson manifests as inputs; writes `LEARNING.md`, `openspec/project.md`, `openspec/AGENTS.md`, per-lesson `openspec/changes/{lesson-id}/` directories (using the correct template A/B/C per lesson type and currency), `research-prompts/` for high-audio lessons, and an empty `lessons/` directory; then makes the initial git commit.

### Modified Capabilities

## Impact

- Fills `.gitkeep` placeholders in `.claude/skills/repo-scaffold/` and `.codex/skills/repo-scaffold/`
- No changes to existing skills, specs, or OpenSpec configuration
- Completes the bootstrap flow — `start-learning` can now hand off to `content-planner` → `repo-scaffold` for a fully scaffolded repo
