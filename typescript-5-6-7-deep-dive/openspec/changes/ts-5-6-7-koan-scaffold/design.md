## Context

New learning repo for TypeScript 5/6/7 version-specific features. The learner is a professional web developer who already understands TypeScript fundamentals and has separate repos for generics, utility types, and symbols. This repo covers only what is new or changed in TS 5.x, 6.0, and 7.0 beta — with explicit version tags so the learner can speak to *when* each feature arrived.

Verification model: `tsc --noEmit` is the sole test runner. A lesson file compiles clean = passes. Type errors on `Expect<Equal<...>>` lines = failing exercise. No vitest, no jest, no extra toolchain.

## Goals / Non-Goals

**Goals:**
- 36 lesson files, each self-contained with full inline context (no external docs needed)
- Both Shape A (add/fix types) and Shape B (refactor old patterns to new syntax)
- Rich comment headers: version tag, problem solved, before/after, edge cases, real-world context
- Shared type-level test utilities (`Expect`, `Equal`, `NotEqual`, `IsAny`)
- Deep decorator coverage (8 lessons across class, method, accessor, field, factories, metadata, patterns)
- Flag-specific lessons use per-directory tsconfig.json to enable the relevant flag
- Version-accurate: content clearly labelled by the TS version that introduced it

**Non-Goals:**
- Runtime test coverage (vitest, jest) — type-level only
- Re-teaching fundamentals (generics, conditional types) already in other repos
- Production application code
- TS < 5.0 content

## Decisions

### D1: Pure tsc, no test runner
**Decision:** `tsc --noEmit` only. Lessons pass when they compile.
**Rationale:** Most exercises are purely type-level. A test runner adds noise. The `Expect<Equal<X, Y>>` pattern turns a type mismatch into a compile error — that IS the test.
**Alternative considered:** vitest + expectTypeOf (used in sibling repos). Rejected because it adds runtime infrastructure that obscures the type-level nature of the work.

### D2: Inline comment format
**Decision:** Each lesson file opens with a bordered comment block containing: version tag, problem motivation, before/after code, how-it-works explanation, edge cases, and real-world applicability.
**Rationale:** The learner wants everything needed for understanding in the file itself. A lesson should be readable as a standalone document, not just an exercise stub.
**Format:**
```
// ═══════════════════════════════════════════════════════
// LESSON NN — Feature Name                   [TS X.Y]
// ───────────────────────────────────────────────────────
// PROBLEM: ...
// SOLUTION: ...
// HOW IT WORKS: ...
// WHEN TO USE: ...
// EDGE CASES: ...
// ═══════════════════════════════════════════════════════
```

### D3: Exercises use @ts-expect-error for "should fail" cases
**Decision:** Lines that *should* produce a type error are preceded by `// @ts-expect-error — <reason>`. This makes the expected failure explicit and itself type-checked (if the line no longer errors, `@ts-expect-error` becomes an error).
**Rationale:** Self-documenting. The exercise fails if the learner accidentally makes a bad type pass.

### D4: Flag-specific lessons get a local tsconfig.json
**Decision:** Lessons about compiler flags (isolatedDeclarations, erasableSyntaxOnly, etc.) live in directories with their own `tsconfig.json` that extends `../../tsconfig.json` and adds the flag.
**Rationale:** Enabling these flags globally would break unrelated lessons. Per-directory tsconfigs scope the flag precisely.
**Verify script:** Runs `tsc --noEmit` for root tsconfig + a separate `tsc -p` for each flag-specific directory.

### D5: TypeScript version pinned to ^6.0
**Decision:** `typescript@^6` as the sole dev dependency.
**Rationale:** TS 6.0 supports all 5.x features and adds 6.0 content. TS 7 lessons note they require `@typescript/native-preview` with a comment at the top of each file, but the repo's default toolchain is TS 6.
**TS 7 lessons:** Lessons 33–36 document tsgo/TS7 concepts; the type-level exercises in those files compile fine under TS 6 since 7.0 has identical type semantics. The narrative content covers the architectural difference.

### D6: Decorator lessons use new stage-3 decorators only
**Decision:** Root tsconfig has no `experimentalDecorators: true`. All decorator lessons use the TC39 stage-3 syntax.
**Rationale:** The repo is explicitly about modern TypeScript. Legacy decorator syntax is only mentioned in lesson 04 as contrast to explain *why* the new syntax exists.

### D7: lib set to esnext
**Decision:** `"lib": ["esnext", "dom"]` in root tsconfig.
**Rationale:** Covers `using`/`await using` (Disposable), Temporal, Map upsert, iterator helpers, and all other modern APIs without per-lesson lib configuration.

## Risks / Trade-offs

- **TS 7 lessons are narrative-heavy** → Mitigated by including type-level exercises that demonstrate `isolatedDeclarations` constraints and `erasableSyntaxOnly` restrictions, which are testable under TS 6.
- **36 lesson files is ambitious** → Each file is self-contained; can be built incrementally. Tasks are ordered so early blocks are independently useful.
- **Decorator lesson complexity** → Stage-3 decorators require understanding of the decorator context objects. Lessons 05–10 build progressively; lesson 04 establishes the conceptual foundation before any code.
- **tsconfig default changes in TS 6** → Lesson 28 explicitly teaches these changes. The repo's own tsconfig is explicit about all settings (no reliance on defaults) so it behaves consistently across TS 5.x and 6.x installs.

## Open Questions

- None — scope is fully defined.
