# Agent Guidelines for This Learning Project

## Lesson templates

When implementing an OpenSpec change for a lesson, look up the lesson's `type` and `currency` in `openspec/project.md`, then follow the matching template:

**Template A — Stable koan** (`type: koan`, `currency: stable`):
1. Write `lessons/{id}/lesson.md` with sections: Motivation, Mechanic, Worked example, Pitfalls, Exercise.
2. Write `lessons/{id}/{topic}.test.ts` — tests that fail by default. Use `// TODO` markers where the learner fills in values.
3. Write `lessons/{id}/{topic}.ts` — workspace stub with `// TODO` markers.

**Template B — Versioned/frontier koan** (`type: koan`, `currency: versioned | frontier`):
Same as Template A, plus:
- At the top of `lesson.md`, add: `> Verified against {library/spec} v{X} on YYYY-MM-DD.`
- Cite sources from `sources.md` inline in `lesson.md` where claims would otherwise be unsourced.
- For `currency: frontier` (lesson 11): add a version compatibility block: requires TypeScript 5.2+ and Node 20.4+.

**Template C — Build piece** (`type: build_piece`):
1. The `specs/` delta in this change's directory is authoritative for the API surface.
2. Write tests in `lessons/{id}/{topic}.test.ts` that assert the spec's interface.
3. Write the implementation in `lessons/{id}/{topic}.ts`.
4. Build-piece lessons accumulate: lesson 12 may import from earlier lessons' output if needed (but for this project there is only one build-piece lesson).

## Content style

- Voice: direct second-person teaching.
- Default lesson sections: Motivation, Mechanic, Worked example, Pitfalls, Exercise.
- Comment density in tests: medium.
- Inline narrative in test files: sparse — put durable explanations in `lesson.md`.
- For iterator/iterable lessons: prefer hand-implemented classes (no generators) when the lesson is about the protocol shape; use generators when the lesson is about generator semantics.

## What NOT to do during `/opsx:apply`

- Do not fetch external docs. All sources were fetched during the bulk planning pass and are recorded in `sources.md` (Template B/C changes). If you need to look something up, stop and flag it — it means the planning pass missed something.
- Do not modify other lessons' files during a single lesson's apply.
- Do not change the syllabus in `openspec/project.md` during apply. If a lesson needs adjustment, open a new change.
- Do not add lessons or rename lesson IDs.
