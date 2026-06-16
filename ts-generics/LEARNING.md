# Learning Project: TypeScript Generics

**Created**: 2026-05-23
**Topic**: TypeScript Generics (deep, comprehensive)
**Goal**: Fluent deep understanding and professional use — read and write advanced generic TypeScript confidently, understand on-the-job edge cases and gotchas, and author reusable generic APIs and libraries.
**Framing/Lens**: none
**Shape**: hybrid
**Build pieces**:
1. Typed `Result<E, T>` library with combinators (map, flatMap, fold, Result.all)
2. Mini schema validator with zod-style `z.infer<>` type extraction

## Scoping answers
- End goal: fluent deep understanding and professional use as a developer
- Current baseline: comfortable with TypeScript basics, wants to go deeper
- Scope boundary: all advanced type-level patterns in scope — conditional types, `infer`, mapped types, template literal types, recursive types, variance, overloads

## Notes
Two build pieces run sequentially in Phase 2. The `Result<E, T>` library (lessons 19–22) exercises variance, conditional types, and combinator design in a familiar functional pattern. The mini schema validator (lessons 23–28) is the capstone — it exercises `infer`, recursive generics, and mapped types under real inference constraints, inspired by Zod v4 architecture (stable as of 2026-05-23; requires TypeScript 5.5+ in production use).
