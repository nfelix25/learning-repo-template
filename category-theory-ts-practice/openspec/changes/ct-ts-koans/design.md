## Context

Greenfield repo. No existing code. The design challenge is primarily structural: how to organize koan files so they teach CT concepts through TypeScript's type system, with consistent patterns that don't require explanation each time.

Key constraints from the proposal:
- Type-level verification: `tsc --noEmit` + `Expect<Equal<...>>`
- Value-level verification: inline `assert()` via `npx tsx <file>`
- Named `TODO` placeholder (not `any`, not `never` — a `unique symbol` type)
- No test runner, no build step, minimal tooling

## Goals / Non-Goals

**Goals:**
- Consistent koan file structure learnable from first encounter
- `TODO` that produces clear, recognizable type errors (not cryptic)
- CT concepts introduced with enough prose to be self-contained (READMEs + header comments)
- Value-level exercises verify behavior with `node:assert` — no extra tooling
- TypeScript 5.x strict mode throughout

**Non-Goals:**
- Covering basic TypeScript (primitives, syntax, basic generics) without CT framing
- Runtime test runner (vitest, jest, etc.)
- Publishing as a library or npm package
- Exhaustive coverage of all CT concepts — depth over breadth per topic

## Decisions

### 1. `TODO` as `unique symbol` type

```typescript
declare const _TODO: unique symbol
export type TODO = typeof _TODO
```

**Why over `any`**: `any` makes `Expect<Equal<any, string>>` pass silently — false green.  
**Why over `never`**: `never` gives cryptic error messages.  
**Unique symbol**: Error reads `Type 'typeof _TODO' is not assignable to type 'string'` — the word `_TODO` appears clearly in the error, signaling exactly what needs to be replaced.

### 2. Value-level `todo()` function

```typescript
export const todo = <T>(_note?: string): T => {
  throw new Error(_note ?? "not implemented")
}
```

Used in function bodies where a type signature alone can't enforce behavior. The return type `T` unifies with whatever the expected return type is, so the file compiles. Running with `npx tsx` will throw, confirming the exercise isn't done.

### 3. Directory structure: topic-grouped, not flat

8 directories, each self-contained with a `README.md`. Files numbered within each directory. The README introduces the CT concept; individual files deepen it through exercises.

```
src/
  utils.ts
  01-objects-and-morphisms/
  02-products-and-coproducts/
  03-parametricity/
  04-functors/
  05-higher-kinded-types/
  06-monads/
  07-adjunctions/
```

**Why over flat**: A flat directory of 50+ files has no narrative arc. Topic grouping lets each README tell a coherent story, and the learner can work a topic to completion before moving on.

### 4. Koan file anatomy

Each file follows this pattern:

```
[header block comment — CT concept, motivation, TS connection]
[imports from utils]
[type definitions or setup the learner does NOT fill in]
[exercises: type alias or function with TODO, followed by Expect<Equal<...>> checks]
[assert() block at bottom — only in value-level files, wrapped in a comment]
```

The header comment is the "lecture." Exercises are the "practice." The Expect checks are the "tests."

### 5. Tooling: `typescript` + `tsx` only

`package.json` scripts:
- `"check": "tsc --noEmit"` — verifies all type exercises
- No `"test"` script — value exercises run per-file with `npx tsx src/.../file.ts`

**Why no vitest**: Adds config, runner overhead, and a new mental model. The koan format is self-contained; vitest would require restructuring files into `describe`/`it` blocks, which adds noise.

### 6. Skip CT concepts with no clean TS encoding

Some CT ideas (limits, colimits beyond products/coproducts, enriched categories, toposes) don't map naturally onto TypeScript's type system. These are intentionally excluded. The goal is clean, idiomatic TS — not forcing awkward encodings.

## Risks / Trade-offs

- **`unique symbol` TODO in object positions**: When `TODO` is used as an object property type, error messages may be slightly more verbose. Acceptable — still clearly shows `_TODO`.
- **Value exercises are unverified at type level**: A learner could write an incorrect `compose` that type-checks. Mitigation: provide enough `Expect<Equal<typeof f, ExpectedType>>` checks to catch the most common wrong implementations.
- **No progression enforcement**: Nothing stops a learner from jumping to module 6 on day 1. Intentional — this is a personal repo, not a course platform.

## Open Questions

- None. Design is straightforward for a greenfield personal repo.
