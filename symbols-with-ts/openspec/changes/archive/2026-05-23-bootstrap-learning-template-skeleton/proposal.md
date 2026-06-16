## Why

The learning-project template currently exists only as a handoff document, so future work has no runnable repository baseline or explicit contract for the first PR-sized milestone. This change creates the minimal skeleton needed to build the template incrementally while keeping Codex and Claude Code compatibility first class from the start.

## What Changes

- Add a repository skeleton for the learning-project template with TypeScript, Vitest, strict compiler settings, and package scripts.
- Add user-facing project documentation that explains the template intent, planned OpenSpec change sequence, and how later skills fit together.
- Add `STYLE.md` with initial learning-project style conventions, including Vitest `expectTypeOf` for type-level tests and no `tsd` dependency.
- Add placeholder directory structure for future learning-project skills in both Codex and Claude Code locations.
- Preserve the existing OpenSpec workflow files and avoid implementing any skill behavior in this change.

## Capabilities

### New Capabilities

- `learning-template-skeleton`: Defines the baseline repository structure, documentation, TypeScript/Vitest configuration, and agent-skill compatibility layout required before building learning-project skills.

### Modified Capabilities

- None.

## Impact

- Affects root project files such as `README.md`, `STYLE.md`, `package.json`, `tsconfig.json`, and `vitest.config.ts`.
- Adds empty or placeholder skill directories under `.codex/skills/` and `.claude/skills/` for the learning-template skills planned in later changes.
- Does not change runtime application behavior, because the repository does not yet contain implemented learning-template skills.
