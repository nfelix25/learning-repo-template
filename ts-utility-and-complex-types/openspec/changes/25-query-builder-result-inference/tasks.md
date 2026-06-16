## 1. Implementation

- [x] 1.1 Review the API surface in `specs/result/spec.md`
- [x] 1.2 Write `lessons/25-query-builder-result-inference/result.test.ts` asserting the spec's WHEN/THEN scenarios
  - Include type-level tests using `expectTypeOf` for the inferred result shapes
- [x] 1.3 Write `lessons/25-query-builder-result-inference/result.ts` implementing the spec
  - Requires TypeScript 4.1+ for template literal `infer` and recursive conditional types
  - May import from lessons 19–24
