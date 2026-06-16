# Deep Research Prompt: Variadic Tuple Inference and Result.all Patterns

**Target tool**: Gemini Deep Research (or comparable)
**Intended use**: Audio-friendly content for NotebookLM
**Lesson**: openspec/changes/22-result-all-and-advanced-inference/

## Prompt

TypeScript 4.0 introduced variadic tuple types — the ability to spread generic tuple type parameters in type-level expressions — which unlocked a new class of strongly-typed combinators that had previously been impossible or required hand-written overload lists. Investigate the design history of this feature: what was the motivating use case, what proposals or RFCs preceded the final design, and how did the TypeScript team decide on the `[...T, ...U]` syntax? How does TypeScript's variadic tuple system compare to similar features in other type systems, and what limitations in the original TypeScript 4.0 release have been lifted in subsequent versions?

The canonical use of variadic tuples is encoding `Promise.all`-style combinators that preserve heterogeneous tuple types — taking a tuple of `Promise<T1>`, `Promise<T2>`, ... and returning a `Promise<[T1, T2, ...]>`. Research what the `lib.d.ts` definition of `Promise.all` looked like before variadic tuples, what the overload-based workaround required, and how the variadic tuple version improves it. How does this same pattern apply to a `Result.all` combinator, and what are the specific inference challenges that arise when the input tuple contains `Result<E1, T1>`, `Result<E2, T2>`, ... and the output needs to collect the `T` types into one tuple and the `E` types into a union?

Advanced variadic tuple patterns quickly run into TypeScript's inference limits. Explore the failure modes: when does the checker fall back to `unknown[]` or `never[]` instead of preserving the tuple structure, what are the constraints on how many levels of mapped-tuple types the checker will traverse before giving up, and what intermediate alias techniques help the checker succeed? What is the relationship between variadic tuples and the `infer` keyword in rest positions, and how do `[...infer Head, infer Tail]` patterns enable recursive type-level algorithms? Where do those recursive patterns hit depth limits, and how do authors escape those limits in practice?

## Source priority (paste into research tool if it accepts source hints)
- https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types
- https://devblogs.microsoft.com/typescript/announcing-typescript-4-0/
- https://github.com/microsoft/TypeScript/pull/39094
- https://github.com/microsoft/TypeScript/issues/5453
