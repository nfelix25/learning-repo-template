---
name: repo-scaffold
description: Write all learning-project files to disk after digest review approval — LEARNING.md, STYLE.md, openspec bridge files, per-lesson change directories (templates A/B/C), research-prompts for high-audio lessons, and the initial git commit. This is the only file-write step in the bootstrap flow.
---

# Repo Scaffold

Materialize all in-memory content from the bootstrap planning pass into a ready-to-execute learning project repository.

**This skill is the only file-write step in the bootstrap flow.** Steps 1–8 are conversational. This is step 9.

## Guardrails

- Do not run until the user has approved the content-planner digest (step 8 gate).
- Do not write `lesson.md`, test files (`.test.ts`), or workspace stub files (`.ts`). Those are written by `/opsx:apply` per lesson.
- Do not fetch external sources. All sources were gathered during the bulk planning pass.
- Do not redo scoping, shape selection, curriculum design, or source fetching.
- Do not ask questions that were already answered in the planning phases.

## Required Inputs

Confirm all inputs are present before writing any files:

- **Approved syllabus YAML** — full manifest with all lessons, including `id`, `type`, `currency`, `audio_value`, `concepts`, `outline`, and `sources` for each lesson.
- **Scoping answers** — end goal, current baseline, scope boundary (for `LEARNING.md`).
- **Shape decision** — `koan`, `build`, or `hybrid`; build-piece name if applicable.
- **Framing/lens** — optional; `none` if absent.
- **Research prompts** — generated prompt content for every `audio_value: high` lesson (from `research-prompt-generator`).
- **Style preferences** — any preferences the user expressed during scoping (for `STYLE.md`).

## Template Selection

Choose the change directory template for each lesson based solely on `type` and `currency`:

| Lesson metadata | Template | Files created |
|---|---|---|
| `type: koan` + `currency: stable` | **A** | `proposal.md`, `tasks.md` |
| `type: koan` + `currency: versioned` or `frontier` | **B** | `proposal.md`, `design.md`, `tasks.md`, `sources.md` |
| `type: build_piece` (any currency) | **C** | `proposal.md`, `design.md`, `specs/` delta, `tasks.md` |

No user input is needed to make this selection — the lesson metadata determines it deterministically.

## Workflow

1. **Confirm inputs.** Verify the approved syllabus and per-lesson manifests are present. Ask only if something is genuinely missing.

2. **Write `LEARNING.md`.** Use the §5.1 schema: topic, goal, framing/lens, shape, build piece (if any), scoping answers, and any user notes from the conversation.

3. **Write `STYLE.md`.** Incorporate any style preferences the user expressed during scoping. Overwrite the template default.

4. **Write `openspec/project.md`.** Use the §5.7 schema: topic, goal, framing, shape, tech stack (TypeScript strict + Vitest + Node, infer versions from `package.json`), conventions (lesson directory format, file naming, test additivity rule), and the full syllabus YAML inlined.

5. **Write `openspec/AGENTS.md`.** Include:
   - Lesson template rules (A/B/C) with concrete instructions for implementing each type
   - Content style rules from `STYLE.md`
   - Guardrails: no external fetching during apply, no cross-lesson file edits, no syllabus changes during apply

6. **Create per-lesson change directories.** For each lesson in the syllabus, create `openspec/changes/{lesson-id}/` and write the files for the appropriate template (A, B, or C). Narrate progress: "Writing lesson {N}/{total}: {id}…"

   Template A files:
   - `proposal.md`: What this lesson teaches, prereqs (link lesson IDs in `depends_on`), success criterion (test suite passes), 1–2 paragraphs.
   - `tasks.md`: Three tasks — (1) write `lessons/{id}/lesson.md`, (2) write `lessons/{id}/{topic}.test.ts`, (3) write `lessons/{id}/{topic}.ts` workspace stub.

   Template B files — same as A plus:
   - `design.md`: Full content manifest — lesson outline (intro, mechanic, worked_example, pitfalls, exercise_setup), sources list, and any framing notes.
   - `sources.md`: Source list matching §5.5 schema.

   Template C files — same as B plus:
   - `specs/` delta: Describes the API surface this lesson adds to the build piece (function signatures, types, behavior in WHEN/THEN format).

7. **Write research prompts.** For each lesson with `audio_value: high`, write `research-prompts/{lesson-id}.md` using the prompt content generated during the bulk planning pass. Match the §5.6 schema.

8. **Create `lessons/` directory.** Write a `.gitkeep` so the directory is tracked by git.

9. **Git commit.** Check for `.git/`; run `git init` if absent. Then:
   ```
   git add -A
   git commit -m "Bootstrap learning project: {topic}"
   ```

10. **Print summary.** Report lesson count, total files written, and the next step:
    ```
    ✓ Scaffold complete — {N} lessons, {F} files written.
    Run `/opsx:apply {first-lesson-id}` to start your first lesson.
    ```

## openspec/project.md Schema Reference (§5.7)

```markdown
# Project Context

## Topic
{topic}

## Goal
{goal}

## Framing / Lens
{framing or "none"}

## Shape
{koan | build | hybrid}; {build piece name if applicable}

## Tech stack
- TypeScript {version} strict
- Vitest {version}
- Node {version}

## Conventions
- Lesson directories: `lessons/{NN-name}/`
- Each lesson contains: `lesson.md`, `{topic}.test.ts`, `{topic}.ts` (workspace)
- Type-level tests via expectTypeOf (Vitest built-in)
- Tests are additive — all tests stay live as lessons are added
- Run full suite: `vitest`; filter to one lesson: `vitest -t "Lesson NN"`

## Syllabus (canonical)
{Full YAML syllabus inlined here}
```
