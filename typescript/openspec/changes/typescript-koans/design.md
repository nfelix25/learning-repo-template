## Context

Greenfield project. Target audience is an experienced web developer with 5 years of TypeScript who has strong practical knowledge but has not gone deep into the type system. The goal is an exhaustive, self-directed curriculum covering intermediate through advanced TypeScript concepts plus all TS5, TS6 features. Runs on TypeScript 7 (Go compiler).

## Goals / Non-Goals

**Goals:**
- 55 numbered koan files covering the full curriculum in strict linear order
- Both type-level assertions and runtime tests in each koan
- Embedded narrative comments that teach the concept without solving it
- `TODO` sentinel enables zero-friction start: everything compiles from day one
- Uses TypeScript 7 for 10x faster iteration cycle

**Non-Goals:**
- Not a beginner curriculum (no `string | number` basics)
- Not a web framework tutorial (no React/Node-specific type patterns)
- Not a library of reusable utilities (koans are exercises, not production code)
- No separate README per koan file

## Decisions

### Decision: Single `TODO` sentinel type
`type TODO = any` is declared at the top of every koan. All blanks reference `TODO`. This means the file compiles immediately; `Expect<Equal<TODO, string>>` passes because `any` satisfies everything. As the learner replaces `TODO` with real types/implementations, the assertions tighten. Only a correctly solved koan produces a fully green test run with no remaining `TODO` references.

**Alternative considered**: `// @ts-ignore` annotations. Rejected — hides errors rather than progressively exposing them.

### Decision: Type-level assertions via compile-time `Expect<Equal<A, B>>`
```typescript
type Expect<T extends true> = T
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
```
These produce a TypeScript compile error (not a runtime error) when `A ≠ B`. Used for pure type-level koans where there is no meaningful runtime behavior to test.

**Alternative considered**: `expectTypeOf()` from Vitest for all type tests. Rejected for pure type koans — `expectTypeOf` requires a runtime value, which is awkward for type aliases. Reserved for runtime tests where types and values are coupled.

### Decision: Linear file numbering enforces curriculum order
Files are named `k-001-topic.ts` through `k-055-topic.ts`. The number is the curriculum contract. No dependency graph to navigate — just work through files in order.

### Decision: Vitest as test runner
Vitest is ESM-native, has first-class TypeScript support, ships `expectTypeOf`, and works without a separate compilation step when paired with `tsx`. Fast watch mode fits the koan iteration loop.

### Decision: `tsx` for test execution
`tsx` runs TypeScript directly via esbuild transpilation, no `tsc` compilation needed for runtime. `tsc --noEmit` is run separately (via `pnpm typecheck`) for compile-time error detection. This splits the workflow:
- `pnpm test` → runtime failures (Vitest)
- `pnpm typecheck` → compile-time failures (`tsc --noEmit`)
Both must pass for a koan to be solved.

### Decision: Strict tsconfig, TypeScript 7 defaults
```json
{
  "strict": true,
  "target": "ES2025",
  "module": "ESNext",
  "moduleResolution": "bundler",
  "lib": ["ES2025"]
}
```
TS6 made `strict: true` the default. We set it explicitly so the tsconfig is self-documenting. `lib: ["ES2025"]` covers Temporal, Set methods, and all TS6 standard library additions.

### Decision: Phase 3 (Mapped Types) before Phase 4 (Conditional Types)
Mapped types are a simpler, more visual concept. Conditional types reference mapped type patterns in their advanced forms (e.g., filtering a mapped type via a conditional). Teaching mapped types first means Phase 4 can build on them without backtracking.

### Decision: TS5/6 features as dedicated late phases (10–11) rather than inline
Teaching `const type parameters` inline in Phase 1 (where it conceptually belongs) would introduce TS version awareness before the learner has mapped/conditional types vocabulary. Instead: master the core type system first, then revisit each release and see how it extends what you know.

## Risks / Trade-offs

- [Compile errors vs runtime errors are separate workflows] → Documented clearly in project README and koan file headers. `pnpm test` and `pnpm typecheck` are both required.
- [TODO = any can mask solver mistakes] → Mitigated by thorough `Expect<Equal<>>` assertions that exercise edge cases; a lucky `any` won't satisfy all of them.
- [55 files is a large commitment] → Phases are self-contained; learner can stop and resume at any phase boundary.
- [TS7 is beta] → Koans will compile on TS6 as well; TS7 is an ergonomic choice for speed, not a requirement.
