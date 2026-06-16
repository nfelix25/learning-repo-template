## Context

The repository currently contains only OpenSpec scaffolding. The intended project is a personal TypeScript learning lab for typed event systems, aimed at an experienced web developer who wants compiler-driven practice with event APIs, listener lifecycle behavior, and communication patterns.

The implementation should stay small and explicit. The repo is not trying to become a production-ready event bus package; it should provide a sequence of focused koans where failing tests and TypeScript diagnostics guide the learning.

## Goals / Non-Goals

**Goals:**

- Provide a test-driven koans workflow for typed TypeScript event patterns.
- Pair runtime assertions with compile-time assertions so the learner sees both implementation behavior and type-system guarantees.
- Keep notes short, adjacent to the koans, and focused on the specific concept under practice.
- Cover event map design, typed emitter implementation, listener lifecycle semantics, inference, variance, async delivery, and platform interop.

**Non-Goals:**

- Publishing an npm package.
- Building a framework-specific demo application.
- Teaching beginner TypeScript syntax or JavaScript fundamentals.
- Exhaustively wrapping Node.js `EventEmitter` or DOM `EventTarget`.

## Decisions

### Use Vitest for Runtime Koans

Vitest gives a lightweight test runner with TypeScript-friendly ergonomics and simple watch mode. Runtime koans should use ordinary test failures to drive implementation work.

Alternative considered: Node's built-in test runner. It would reduce dependencies, but Vitest has stronger ergonomics for a koans repo and is familiar in modern TypeScript projects.

### Use `tsc --noEmit` for Compile-Time Koans

Compile-time assertions should use TypeScript itself, primarily through `@ts-expect-error`, `satisfies`, literal inference, and strict compiler settings. This keeps type tests close to the code and avoids introducing a separate type-test DSL too early.

Alternative considered: `tsd` or `expect-type`. Those tools can be useful later, but they add another testing surface before the repo needs it.

### Keep Koans as Tests with Companion Notes

Each koan should be a test file under `koans/` with intentionally incomplete implementation or TODO markers. Each note should explain the concept, the relevant TypeScript move, and one or two tradeoffs.

Alternative considered: notebook-style runnable examples. That format is easier to read passively, but it weakens the compiler/test feedback loop that is central to this repo.

### Separate Learning Implementations from Koan Tests

Reusable exercise code should live under `src/`, while `koans/` describes expected behavior and type guarantees. This keeps the implementation surface easy to revisit and prevents test files from becoming the main library.

Alternative considered: putting all implementation inline in koan files. That works for tiny examples, but makes later koans harder to build on.

## Risks / Trade-offs

- Type-only assertions can be brittle across TypeScript versions -> Pin a current TypeScript version and keep type tests focused on stable language behavior.
- Koans can become too broad and lose their learning edge -> Keep each koan centered on one concept and defer wider architectural patterns until later files.
- Runtime and compile-time tests can obscure each other -> Use naming and notes to make clear which failures are expected to be fixed by runtime code versus types.
- Platform interop can become a large side quest -> Treat DOM `EventTarget` and Node-style emitters as comparison points, not full compatibility targets.

## Migration Plan

No migration is required. This change initializes the learning repo structure from an effectively empty project.

## Open Questions

- Whether later koans should introduce a dedicated type assertion helper after the initial `@ts-expect-error` approach has reached its limits.
- Whether async delivery should remain implementation-only or include a deeper note on the JavaScript event loop and microtask scheduling.
