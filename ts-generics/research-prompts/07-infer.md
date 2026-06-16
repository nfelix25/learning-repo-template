# Deep Research Prompt: The infer Keyword

**Target tool**: Gemini Deep Research (or comparable)
**Intended use**: Audio-friendly content for NotebookLM
**Lesson**: openspec/changes/07-infer/

## Prompt

The `infer` keyword, introduced with conditional types in TypeScript 2.8, allows the type system to capture and name a type that is structurally matched during a conditional type check. Before `infer` existed, extracting the return type of a function or the element type of an array required tedious overload-based tricks or was simply impossible at the type level. Investigate the design history of `infer` — what problem was it solving, what alternatives were considered, and why the syntax of placing `infer X` inside an `extends` clause was chosen over alternatives. How does `infer` relate to pattern matching in other type systems, and what makes TypeScript's version distinct from approaches in languages like Haskell or Scala?

The placement of `infer` within a type structure has semantic consequences that many developers miss. Explore what it means for an `infer` binding to appear in a covariant versus a contravariant position — why does `infer` in a function parameter position produce an intersection rather than a union when multiple inferences conflict? How does TypeScript's 4.7 release extend `infer` with variance annotations (`infer X extends string`), and what class of inference errors does that fix? Trace the evolution of `infer` across TypeScript versions to understand where the feature was initially limited and where later releases expanded its power.

Real-world patterns built on `infer` — `ReturnType`, `Parameters`, `InstanceType`, `Awaited` — are now foundational to production TypeScript. Research how these utility types came to be in the standard library and what requests from the community drove their inclusion. What are the limits of `infer` today — the cases where developers expect to extract a type but TypeScript resolves to `never` or `unknown` — and how do experienced authors work around those limits with intermediate aliases or conditional chains?

## Source priority (paste into research tool if it accepts source hints)
- https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
- https://devblogs.microsoft.com/typescript/announcing-typescript-2-8/
- https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/
- https://github.com/microsoft/TypeScript/pull/21496
