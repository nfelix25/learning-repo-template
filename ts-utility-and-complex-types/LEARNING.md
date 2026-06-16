# Learning Project: TypeScript Utility Types and Complex Type Patterns

**Created**: 2026-05-24
**Topic**: TypeScript utility types and complex type patterns
**Goal**: Personal and professional enrichment — understand how utility types are constructed mechanically, and become fluent with advanced type patterns for Node/TypeScript web development including React.
**Framing/Lens**: none
**Shape**: hybrid
**Build piece**: Typed SQL-style query builder — a type-safe query API where the type system encodes table schema, column references, chained builder state, and result types without any runtime overhead

## Scoping answers

- **End goal**: Deep mechanical understanding of how utility types are built from mapped types, conditional types, and infer; broad fluency with advanced patterns useful in real web dev work
- **Current baseline**: Senior TypeScript developer. Aware of conditional types, infer, variance/covariance, distributive behavior, recursive patterns, and advanced union/intersection tricks — but confused about mechanics and when to reach for which pattern
- **Scope boundary**: Includes React-specific type gymnastics (no library overhead). Excludes runtime validation libraries (Zod, io-ts, etc.)
- **Depth/breadth**: Both — broad fluency across the type toolkit AND depth in the hardest corners

## Notes

Lessons 08, 11, 12, 13, 18, and 25 are versioned — they cite specific TypeScript versions and should be verified against your installed version (`tsc --version`).

Lesson 18 covers both the React 18 `forwardRef` pattern and the React 19 `ref`-as-prop replacement — these are meaningfully different. Note which React version your project uses before applying.

All build-piece lessons (19–26) accumulate into the same typed query builder. Apply them in order; later lessons import types from earlier ones.
