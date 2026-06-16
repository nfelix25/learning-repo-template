# Agent Guidelines for This Learning Project

## Lesson templates

When implementing an OpenSpec change for a lesson, look up the lesson's `type` and `currency` in `openspec/project.md`, then follow the matching template:

**Template A — Stable koan** (`type: koan`, `currency: stable`):
1. Write `lessons/{id}/lesson.md` with sections: Motivation, Mechanic, Worked example, Pitfalls, Exercise.
2. Write `lessons/{id}/{topic}.test.ts` — tests that fail by default. Use `// TODO` markers where the learner fills in values.
3. Write `lessons/{id}/{topic}.ts` — workspace stub with `// TODO` markers.

**Template B — Versioned koan** (`type: koan`, `currency: versioned`):
Same as Template A, plus:
- At the top of `lesson.md`, add: `> Verified against TypeScript v{X} on YYYY-MM-DD.`
- Cite sources from `sources.md` inline in `lesson.md` where claims would otherwise be unsourced.
- Lessons 08, 11, 12, 13: version-gate the TS version requirement at the top.
- Lesson 18: add a React version note — cover both React 18 (`forwardRef`) and React 19 (`ref` as prop) patterns, clearly labeled.
- Lesson 25: note TS 4.1+ required for template literal `infer` and recursive conditional types.

**Template C — Build piece** (`type: build_piece`):
1. The `specs/` delta in this change's directory is authoritative for the API surface added by this lesson.
2. Write tests in `lessons/{id}/{topic}.test.ts` that assert the spec's WHEN/THEN scenarios.
3. Write the implementation in `lessons/{id}/{topic}.ts`.
4. Build-piece lessons accumulate — later lessons may import from earlier build-piece lesson files. The module graph flows strictly in lesson-number order.

## Content style

- Voice: direct second-person teaching.
- Default lesson sections: Motivation, Mechanic, Worked example, Pitfalls, Exercise.
- Comment density in tests: medium.
- Inline narrative in test files: sparse — put durable explanations in `lesson.md`.
- Prefer small named types over dense inline expressions when the name clarifies intent.
- Keep runtime helpers minimal in koans; the type behavior is often the lesson.
- Generated examples should be readable before they are clever.

## Type-level testing

Use `expectTypeOf` from Vitest for all type assertions:
```ts
import { expectTypeOf } from 'vitest'
expectTypeOf<MyType>().toEqualTypeOf<ExpectedType>()
expectTypeOf<MyType>().toMatchTypeOf<BroaderType>()
```

Do not use `tsd` or external type assertion libraries.

## What NOT to do during `/opsx:apply`

- Do not fetch external docs. All sources were fetched during the bulk planning pass and are recorded in `sources.md` (Template B/C changes). If content is missing, stop and flag it — it means the planning pass missed something.
- Do not modify other lessons' files during a single lesson's apply.
- Do not change the syllabus in `openspec/project.md` during apply. If a lesson needs adjustment, open a new change.
- Do not add lessons or rename lesson IDs.
- Do not write `lesson.md`, test files, or workspace stubs during `/repo-scaffold` — those are written by `/opsx:apply` per lesson.
