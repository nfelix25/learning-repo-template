## Context

This is the most complex skill in the bootstrap flow. Every earlier skill (scoping, curriculum-design, content-planner, research-prompt-generator) is conversational and produces no files. `repo-scaffold` is the single point where all accumulated in-memory state gets committed to disk. It runs exactly once per learning project bootstrap.

The skill receives a complete package: the approved syllabus YAML (from content-planner digest approval) plus all per-lesson manifests with populated `outline`, `sources`, and optional `framing_notes`. It must map each lesson to the correct OpenSpec change template (A, B, or C) and write everything atomically from the learner's perspective.

The template repo already provides `package.json`, `tsconfig.json`, `vitest.config.ts`, and a default `STYLE.md`. These files are part of the skeleton and the skill does not need to regenerate them from scratch — it writes `LEARNING.md` (topic-specific), `openspec/project.md` (topic-specific), and `openspec/AGENTS.md` (topic-specific), and scaffolds the per-lesson change directories.

## Goals / Non-Goals

**Goals:**
- Define the full behavior of the `repo-scaffold` skill, including all file write steps and the initial git commit
- Specify the template A/B/C selection logic per lesson
- Specify the `openspec/project.md` and `openspec/AGENTS.md` content rules

**Non-Goals:**
- Modifying `start-learning`, `content-planner`, or `research-prompt-generator`
- Handling mid-scaffold failures or partial re-runs (the skill runs once after full digest approval)
- Generating lesson content (lesson.md, test files) — those are written by `/opsx:apply` per lesson

## Decisions

### Skill writes files directly; no dry-run mode

The user has already approved the digest at step 8. By the time `repo-scaffold` runs, all content decisions are final. A dry-run or preview mode would duplicate the digest review gate and add complexity for no benefit.

*Alternative considered*: Preview the file list before writing. Rejected — the digest review IS the preview. Adding another gate here violates the flow's single-gate-per-phase principle.

### Template selection is deterministic from lesson metadata

The skill picks the change template by two fields only:
- `type: build_piece` → Template C (always, regardless of currency)
- `type: koan` + `currency: stable` → Template A
- `type: koan` + `currency: versioned | frontier` → Template B

No user input is needed for this decision. The mapping is defined in HANDOFF.md §5.4.

*Alternative considered*: Let user choose template per lesson. Rejected — the metadata already encodes the right choice.

### LEARNING.md and STYLE.md behavior

`LEARNING.md` is always written fresh — it's topic-specific and doesn't exist in the template skeleton. `STYLE.md` already exists in the template with defaults from the bootstrap conversation. The skill writes a finalized `STYLE.md` incorporating any preferences the user expressed during scoping, overwriting the template default.

### openspec/AGENTS.md content

This file provides lesson-implementation rules that OpenSpec inherits for every lesson change. It must include: lesson directory convention (`lessons/{NN-name}/`), required file set per lesson (`lesson.md`, `{topic}.test.ts`, `{topic}.ts`), test additivity rule (all prior tests must remain passing), and the koan/build-piece task templates from §5.4.

### Initial git commit

After all files are written, the skill runs `git add -A` and `git commit -m "Bootstrap learning project: {topic}"`. This gives the learner a clean baseline to diff against as they apply lessons.

## Risks / Trade-offs

- **Large syllabus write time** → Scaffolding 15–20 lesson directories takes several seconds of file writes. Mitigation: skill narrates progress ("Writing lesson 1/18…") so the learner knows it's working.
- **AGENTS.md drift** → If lesson implementation conventions change after bootstrapping, AGENTS.md becomes stale. Mitigation: document in AGENTS.md that it reflects the bootstrap-time conventions and can be updated manually.
- **git not initialized** → The skill assumes git is already initialized (template ships with a git repo). If somehow it isn't, `git add -A` will fail. Mitigation: skill checks for `.git/` and runs `git init` if absent before the commit step.
