## Context

This is a purely type-level TypeScript learning project. The goal is to reconstruct Zod's internal type architecture from scratch — not to produce a working validation library, but to deeply understand the TypeScript patterns Zod's authors used to solve real design problems. No runtime validation logic is required; `tsc --noEmit` is the only execution target.

The learner is already comfortable with advanced TypeScript (generics, conditional types, mapped types). The koans are not teaching TypeScript basics — they are teaching *Zod-specific* design decisions and the patterns behind them.

## Goals / Non-Goals

**Goals:**
- Produce 10 koan files that each isolate one Zod internal type pattern
- Each koan has a prose explanation of the design decision Zod made, followed by TODO stubs and type-level assertions
- Provide `Expect<Equal<>>` test harness (pre-built, explained) and a `primitives.solution.ts` fallback
- Project is runnable with `tsc --noEmit`; passing = no type errors

**Non-Goals:**
- No runtime validation logic — `.parse()`, `.safeParse()`, `ZodError` are out of scope
- No CLI, build pipeline, or npm publishing
- No attempt to match Zod's exact API surface — structural similarity is enough

## Decisions

### Koan isolation via shared primitives

**Decision**: Each koan imports only from `src/shared/` (pre-built types), not from previous koan solutions. Koans are independent.

**Rationale**: If koans chained on each other, a mistake in koan 02 would cascade and break koans 03–09 in ways unrelated to what each koan is teaching. Independence lets you work on any koan without completing prior ones.

**Alternative considered**: Cumulative build (each koan extends the previous). Rejected because debugging cascading type errors is frustrating and discourages exploration.

### Stub format: `type TODO = never`

**Decision**: Stubs use `type TODO = never`. Incomplete implementations cause type errors on the assertions, not on unrelated code.

**Rationale**: `never` is the bottom type — it assignable to nothing, so every assertion fails loudly until the type is filled in. `any` would be worse: it silences errors and gives false "passing" feedback.

**Alternative considered**: `type TODO = any`. Rejected — `any` makes assertions trivially pass, defeating the purpose.

### Comment pattern: orient, don't hint

**Decision**: Each TODO gets a single comment naming the TypeScript pattern involved (e.g., `// Pattern: mapped type with indexed access`). No code hints, no examples.

**Rationale**: Naming the pattern is enough for an advanced TypeScript user to look it up or recall it. More guidance removes the discovery that makes koans valuable.

### Prose placement: above the stubs

**Decision**: The prose explanation of Zod's design decision comes in a JSDoc block at the top of each file, before any types to implement.

**Rationale**: The learner needs context *before* looking at the stubs — otherwise the stubs are just puzzles rather than guided reconstruction of a real design.

### tsconfig: strict + noEmit + moduleResolution bundler

**Decision**: `strict: true`, `noEmit: true`, `moduleResolution: "bundler"`, `target: "ES2022"`.

**Rationale**: `strict` ensures `strictNullChecks` and related flags are on — required for Optional/Nullable koans to have meaning. `noEmit` makes clear this is type-only. `bundler` resolution supports extensionless imports cleanly.

### primitives.solution.ts as an importable fallback

**Decision**: The fallback file is a normal TypeScript module you can swap into an import statement, not a separate solution directory.

**Rationale**: Changing one import line to unblock yourself is frictionless. It also makes the fallback structurally identical to the user's own file — you can diff them directly.

## Risks / Trade-offs

- [Risk] Type-level-only assertions may feel less satisfying than runtime tests → Mitigation: prose explanations give each koan a narrative payoff beyond "it compiles"
- [Risk] `ZodType` phantom properties require careful variance — `_output: Output` vs `_output!: Output` → Mitigation: solution file shows the exact declaration; koan 00 prose explains why `!` (definite assignment assertion) is used

## Open Questions

- None — scope is fully determined by the explored curriculum.
