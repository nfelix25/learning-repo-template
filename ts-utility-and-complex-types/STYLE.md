# Style Preferences

These defaults guide the learning projects and skills this template will generate. Later bootstrap conversations can refine them for a specific topic.

## Test Framework Conventions

- Framework: Vitest.
- Type-level tests: use `expectTypeOf` from Vitest.
- Do not use `tsd` for v1 projects.
- File naming: `{topic}.test.ts` inside each lesson directory.
- Lesson test names should include the lesson number when useful for filtering.

## Koan Style

- Default size: 5 to 8 assertions per koan.
- Format: mixed fill-in-the-blank and implement-the-function exercises.
- Prefer `// TODO` markers in workspace files for learner edits.
- Tests should fail clearly before the learner completes the exercise.
- Keep each koan focused on one mechanic or one tightly related set of mechanics.

## Content Style

- Voice: direct second-person teaching.
- Default lesson sections: Motivation, Mechanic, Worked example, Pitfalls, Exercise.
- Comment density in tests: medium.
- Inline narrative in test files: sparse; put durable explanations in `lesson.md`.
- Cite recorded sources for versioned or frontier claims.

## Code Style

- TypeScript strict mode: true.
- `noUncheckedIndexedAccess`: true.
- Prefer small named types over dense inline type expressions when the name clarifies intent.
- Keep runtime helpers minimal in koans; the type behavior is often the lesson.
- Generated examples should be readable before they are clever.

## OpenSpec Lesson Conventions

- Lessons are additive: completed lesson files remain live as later lessons are added.
- Each generated lesson should live under `lessons/{NN-name}/`.
- Each lesson should contain `lesson.md`, `{topic}.test.ts`, and `{topic}.ts` unless a later spec explicitly changes the shape.
- Per-lesson implementation should not fetch external docs; sources are planned before scaffolding.
