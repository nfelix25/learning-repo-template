# Agent Guidelines for This Learning Project

## Lesson templates

When implementing an OpenSpec change for a lesson, look up the lesson's `type` and `currency` in `openspec/project.md`, then follow the matching template.

**Template A - Stable koan** (`type: koan`, `currency: stable`):
1. Write `lessons/{id}/lesson.md` with sections: Motivation, Mechanic, Worked example, Pitfalls, Exercise.
2. Write `lessons/{id}/symbols.test.ts` - tests that fail by default. Use `// TODO` markers where the learner fills in values.
3. Write `lessons/{id}/symbols.ts` - workspace stub with `// TODO` markers.

**Template B - Versioned/frontier koan** (`type: koan`, `currency: versioned | frontier`):
Same as Template A, plus:
- At the top of `lesson.md`, add: `> Verified against {library/spec} on YYYY-MM-DD.`
- Cite sources from `sources.md` inline in `lesson.md` where claims would otherwise be unsourced.
- For disposal symbols, keep runtime support checks explicit because parser and runtime support can differ.

**Template C - Build piece** (`type: build_piece`):
This project has no build-piece lessons. If a future change adds one, the change's `specs/` delta is authoritative for its API surface.

## Content style

- Voice: direct second-person teaching.
- Default lesson sections: Motivation, Mechanic, Worked example, Pitfalls, Exercise.
- Comment density in tests: medium.
- Inline narrative in test files: sparse - put durable explanations in `lesson.md`.
- Keep TypeScript secondary; it should clarify symbol-heavy JavaScript rather than become the lesson target.
- Prefer small examples that expose one runtime rule at a time.

## What NOT to do during `/opsx:apply`

- Do not fetch external docs. All versioned sources are recorded in `sources.md` for Template B changes. If you need to look something up, stop and flag it as a planning gap.
- Do not modify other lessons' files during a single lesson's apply.
- Do not change the syllabus in `openspec/project.md` during apply. If a lesson needs adjustment, open a new change.
- Do not add lessons or rename lesson IDs.
