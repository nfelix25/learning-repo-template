## Context

The repository currently contains the build handoff plus the existing OpenSpec/Codex/Claude workflow support, but it does not yet have the learning-template project skeleton described in the handoff. Later changes will add skills such as `start-learning`, `curriculum-design`, `content-planner`, and `repo-scaffold`; those changes need a stable repository baseline and documented conventions first.

Constraints from the handoff and follow-up decisions:

- The v1 template targets TypeScript/JavaScript learning projects only.
- Type-level tests use Vitest `expectTypeOf`; `tsd` is intentionally out of scope.
- Codex compatibility is first class, so future learning skills need Codex-facing files as well as Claude Code-facing files.
- This change must not implement learning-template skill behavior.

## Goals / Non-Goals

**Goals:**

- Create the root repository skeleton for a TypeScript/Vitest project.
- Document the repository purpose, build roadmap, and next OpenSpec changes.
- Capture initial style conventions in `STYLE.md`.
- Add trackable placeholder locations for future learning-template skills under both `.codex/skills/` and `.claude/skills/`.
- Preserve existing OpenSpec workflow support.

**Non-Goals:**

- Implement `start-learning` or any other learning-template skill.
- Generate a learning project from a topic seed.
- Fetch sources, generate research prompts, or scaffold lesson changes.
- Add `tsd` or a second type-test runner.
- Archive or apply any future roadmap change.

## Decisions

### Use a minimal TypeScript/Vitest baseline

The skeleton will add `package.json`, `tsconfig.json`, and `vitest.config.ts` so the repository has a real test/build surface before skill work starts. The TypeScript config should be strict and include `noUncheckedIndexedAccess`.

Alternative considered: defer package configuration until the first implemented skill. Rejected because the next changes need a shared verification surface, and the handoff explicitly calls for skeleton-first work.

### Use Vitest `expectTypeOf` for type-level tests

The skeleton documents Vitest `expectTypeOf` as the type-level testing convention and omits `tsd`.

Alternative considered: add `tsd` for stronger standalone type assertions. Rejected for v1 because `expectTypeOf` keeps the toolchain smaller and matches the user decision.

### Treat Codex and Claude Code skill layouts as peer targets

The skeleton will reserve future learning-template skill directories in both `.codex/skills/` and `.claude/skills/`. Because Git does not track empty directories, each placeholder directory should contain a small placeholder file such as `.gitkeep`.

Alternative considered: store one canonical skill tree and generate the other later. Rejected for the skeleton because Codex compatibility is a first-class requirement, not a later packaging step.

### Keep documentation lightweight but explicit

`README.md` should summarize the purpose of the repository and include the agreed build roadmap. `STYLE.md` should capture style defaults for generated learning projects and tests.

Alternative considered: keep all planning only in `HANDOFF.md`. Rejected because `HANDOFF.md` is a design handoff, while contributors need a short operational entry point.

## Risks / Trade-offs

- Placeholder skill directories can drift from the eventual skill names -> use the roadmap names from the agreed sequence and handoff section 6.
- Mirroring Codex and Claude Code directories can duplicate future edits -> keep this change to placeholders only; later skill changes can decide whether to use generated mirrors or hand-maintained prompt variants.
- Adding package dependencies may require network access during verification -> package files should declare the intended dev dependencies, but implementation can verify syntax and run tests after dependencies are installed.
- A broad skeleton can accidentally become skill implementation -> tasks must exclude any functional `SKILL.md` for the new learning-template skills.
