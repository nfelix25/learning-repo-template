## 1. Implementation

- [x] 1.1 Write `lessons/23-schema-design-and-goals/lesson.md` — include `> Architecture reference: Zod v4 (stable as of 2026-05-23).` at the top. Sections: Motivation, Mechanic, Worked example, Pitfalls, Exercise.
- [x] 1.2 Write `lessons/23-schema-design-and-goals/schema.test.ts` — type-level tests verifying `Infer<Schema<string>>` = `string`, `Infer<Schema<number>>` = `number`
- [x] 1.3 Write `lessons/23-schema-design-and-goals/schema.ts` — `Schema<T>` abstract class/interface, `Infer<S>` type, `ParseError` type, and full API surface as abstract/unimplemented signatures
