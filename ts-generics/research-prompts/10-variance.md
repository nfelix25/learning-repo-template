# Deep Research Prompt: Variance in TypeScript's Type System

**Target tool**: Gemini Deep Research (or comparable)
**Intended use**: Audio-friendly content for NotebookLM
**Lesson**: openspec/changes/10-variance/

## Prompt

Variance is one of the most foundational concepts in type theory, yet it often goes unnamed in everyday TypeScript work — developers encounter it as a surprising compile error or an unexpected assignability result without understanding the principle behind it. Investigate the history of variance as a concept in programming language theory: how did covariance, contravariance, invariance, and bivariance arise as formal categories, and why do they matter for any language that has both subtyping and parameterized types? How do other typed languages — Java, C#, Kotlin, Scala — approach variance, and where does TypeScript's approach diverge?

TypeScript's variance rules have evolved significantly. The language began with structural typing and a relatively permissive approach to function parameter types (bivariance by default under `strictFunctionTypes: false`). Explore the reasoning behind the initial bivariant approach, the class of real-world bugs it permitted, and what motivated the shift toward stricter function parameter contravariance in TypeScript 2.6. Why are method signatures in interfaces and classes still treated bivariantly, and what practical backward-compatibility concern drove that carve-out? What is the `strictFunctionTypes` flag doing at the type-checker level?

TypeScript 4.7 introduced explicit variance annotations — the `in` and `out` modifiers on type parameters — allowing authors to declare intent rather than relying on inference. Research what drove this feature: were there performance problems with inferred variance, correctness problems, or both? How does the checker use declared variance differently from inferred variance, and what are the failure modes when a developer declares variance incorrectly? Consider the deeper question: is structural typing fundamentally in tension with variance, and how has the TypeScript team navigated that tension over the years?

## Source priority (paste into research tool if it accepts source hints)
- https://www.typescriptlang.org/docs/handbook/2/generics.html
- https://devblogs.microsoft.com/typescript/announcing-typescript-2-6/
- https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/
- https://github.com/microsoft/TypeScript/pull/48240
