# Style Preferences

## Test Framework Conventions

- Framework: Vitest.
- Type-level tests: use `expectTypeOf` from Vitest when TypeScript notation is relevant.
- Do not use `tsd` for v1 projects.
- File naming: `symbols.test.ts` inside each lesson directory.
- Lesson test names should include the lesson number when useful for filtering.

## Koan Style

- Default size: 5 to 8 assertions per koan.
- Format: mixed prediction, fill-in-the-blank, and implement-the-function exercises.
- Prefer `// TODO` markers in workspace files for learner edits.
- Tests should fail clearly before the learner completes the exercise.
- Keep each koan focused on one mechanic or one tightly related set of mechanics.
- Use TypeScript only as support notation; the primary claims should be JavaScript runtime claims.

## Content Style

- Voice: direct second-person teaching.
- Default lesson sections: Motivation, Mechanic, Worked example, Pitfalls, Exercise.
- Comment density in tests: medium.
- Inline narrative in test files: sparse; put durable explanations in `lesson.md`.
- Cite recorded sources for versioned claims.
- Treat symbols as public protocol tools unless the lesson is explicitly contrasting them with private fields.

## Code Style

- TypeScript strict mode: true.
- `noUncheckedIndexedAccess`: true.
- Prefer small named types over dense inline type expressions when the name clarifies intent.
- Keep runtime helpers minimal in koans; the symbol behavior is usually the lesson.
- Generated examples should be readable before they are clever.

## OpenSpec Lesson Conventions

- Lessons are additive: completed lesson files remain live as later lessons are added.
- Each generated lesson should live under `lessons/{NN-name}/`.
- Each lesson should contain `lesson.md`, `symbols.test.ts`, and `symbols.ts`.
- Per-lesson implementation should not fetch external docs; sources are planned before scaffolding.
