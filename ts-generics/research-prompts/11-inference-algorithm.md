# Deep Research Prompt: TypeScript's Type Inference Algorithm

**Target tool**: Gemini Deep Research (or comparable)
**Intended use**: Audio-friendly content for NotebookLM
**Lesson**: openspec/changes/11-inference-algorithm/

## Prompt

TypeScript's type inference is often described as "smart" or "powerful," but these adjectives obscure what is actually a complex algorithm with precise rules, priority orderings, and documented failure modes. Investigate what is actually known about how TypeScript's inference algorithm works — how it collects inference candidates from generic function call sites, how it resolves conflicts between multiple candidates, and what the priority rules are when some inference sites produce more specific results than others. How does contextual typing interact with generic inference, and what does it mean for a call site to be "in a contextually typed position"?

TypeScript's inference has had to evolve to handle increasingly sophisticated patterns. Explore the history of improvements to inference across major versions — how did the introduction of conditional types require new inference machinery, and what was the "deferred" evaluation model the team chose for conditional types appearing in generic contexts? How did variadic tuple types (TypeScript 4.0) force changes to how the checker reasons about rest elements and tuple spreads? What is "return type inference" and how does it differ from parameter-site inference?

There is a class of TypeScript inference bugs and limitations that every professional developer eventually hits: the `any` leak when inference fails, the `unknown` widening when the checker gives up, the cases where adding an explicit annotation resolves an error that looked like a logic mistake. Research what the TypeScript team has said about these inference failure modes, how the `--strict` family of flags changes inference behavior, and what heuristics experienced authors use to diagnose and fix inference failures. What is the intended mental model for understanding when to trust inference versus when to annotate explicitly?

## Source priority (paste into research tool if it accepts source hints)
- https://www.typescriptlang.org/docs/handbook/type-inference.html
- https://github.com/microsoft/TypeScript/wiki/TypeScript-Design-Goals
- https://devblogs.microsoft.com/typescript/
- https://github.com/microsoft/TypeScript/blob/main/src/compiler/checker.ts
