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

**Template C — Build piece** (`type: build_piece`, any currency):
1. The `specs/` delta in this change's directory is authoritative for the API surface.
2. Write tests in `lessons/{id}/{topic}.test.ts` that assert the spec's interface.
3. Write the implementation in `lessons/{id}/{topic}.ts`.
4. Build-piece lessons accumulate:
   - Result lessons (19–22): workspace is `result.ts` / `result.test.ts` — each lesson adds to the file from the previous lesson.
   - Schema lessons (23–28): workspace is `schema.ts` / `schema.test.ts` — each lesson adds to the file from the previous lesson.

## Topic names by lesson

| Lesson | Test file |
|--------|-----------|
| 01–18 (koans) | `{short-topic}.test.ts` — see lesson `design.md` or `proposal.md` for the exact name |
| 19–22 (Result) | `result.test.ts` |
| 23–28 (Schema) | `schema.test.ts` |

## Content style

- Voice: direct second-person teaching.
- Default lesson sections: Motivation, Mechanic, Worked example, Pitfalls, Exercise.
- Comment density in tests: medium.
- Inline narrative in test files: sparse — put durable explanations in `lesson.md`.
- For generic lessons: prefer generic functions over generic classes when either form demonstrates the concept. Generic classes add syntax noise that can obscure type-level behavior.
- Use `expectTypeOf` for type-level assertions alongside `expect` for runtime behavior.
- For versioned lessons: cite the source at the top of `lesson.md` as `> Verified against TypeScript vX.Y on YYYY-MM-DD.`

## What NOT to do during `/opsx:apply`

- Do not fetch external docs. All sources were fetched during the bulk planning pass and are recorded in `sources.md` (Template B changes) or `design.md` (Template C changes). If you need to look something up, stop and flag it — it means the planning pass missed something.
- Do not modify other lessons' files during a single lesson's apply.
- Do not change the syllabus in `openspec/project.md` during apply. If a lesson needs adjustment, open a new change.
- Do not add lessons or rename lesson IDs.
- Do not rewrite the Result or Schema workspace from scratch in each lesson — accumulate on top of prior lesson output.
