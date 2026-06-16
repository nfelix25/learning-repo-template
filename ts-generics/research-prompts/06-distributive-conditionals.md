# Deep Research Prompt: Distributive Conditional Types

**Target tool**: Gemini Deep Research (or comparable)
**Intended use**: Audio-friendly content for NotebookLM
**Lesson**: openspec/changes/06-distributive-conditionals/

## Prompt

When TypeScript introduced conditional types in version 2.8, the team made a subtle but consequential design decision: conditional types applied to a naked type parameter would automatically distribute over union types. Rather than treating `T extends string ? "yes" : "no"` as a single check when `T` is `string | number`, TypeScript maps the conditional over each union member and returns a union of results. Investigate the reasoning behind this design choice — what problems does distributivity solve, and what class of type-level transformations does it enable that would otherwise require complex workarounds?

The practical implications of distributivity are far-reaching, but so are its surprising failure modes. Explore the cases where developers expect distribution but don't get it — particularly when wrapping a type parameter in a tuple or object shape suppresses the behavior — and the inverse case where distribution happens unexpectedly and produces incorrect results. Why does wrapping `T` in `[T]` suppress distributivity, and what does that reveal about how the TypeScript checker categorizes "naked" versus "clothed" type parameters? How do the built-in utility types like `NonNullable`, `Extract`, and `Exclude` leverage distributivity, and how would their definitions differ without it?

Consider the deeper design tension this feature introduces. Distributive conditionals make `T extends never ? X : Y` evaluate to `never` when `T` is `never`, which surprises most TypeScript developers encountering it for the first time. Trace the logic of why this happens and what it means for defensive type programming. How have experienced TypeScript authors learned to recognize when they need to suppress distributivity, and what are the telltale signs in type tests that reveal distribution is occurring when it shouldn't?

## Source priority (paste into research tool if it accepts source hints)
- https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
- https://devblogs.microsoft.com/typescript/announcing-typescript-2-8/
- https://github.com/microsoft/TypeScript/pull/21316
