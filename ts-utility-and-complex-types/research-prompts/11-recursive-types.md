# Deep Research Prompt: Recursive Types — Design, Limits, and the Depth Problem

**Target tool**: Gemini Deep Research (or comparable)
**Intended use**: Audio-friendly content for NotebookLM
**Lesson**: openspec/changes/11-recursive-types/

## Prompt

Recursive types in TypeScript have a layered history: for years, certain recursive type aliases were rejected by the compiler with "type alias circularly references itself," forcing developers to use an interface workaround. TypeScript 3.7 relaxed this restriction for type aliases in object/array/tuple positions. TypeScript 4.1 went further, allowing recursive *conditional* types. Research why these features were withheld for so long and why they were eventually added. What implementation challenge did the TypeScript compiler team have to solve? The interesting angle is not "what is a recursive type" but "why was this hard to add to a structural type system designed around eager evaluation?"

Explore the depth limit problem. TypeScript tracks instantiation depth and terminates with "type instantiation is excessively deep and possibly infinite" when recursive types go too deep. This is not a bug — it's a deliberate safeguard against infinite loops in the type checker. How does the TypeScript team balance expressiveness (allowing useful deep recursion) against compiler performance and termination guarantees? What is "tail recursion optimization" in this context, and how does the accumulator pattern — borrowed from functional programming — let TypeScript extend the effective depth of recursive type computation?

Touch on the real-world implications: a `DeepReadonly<T>` that works on typical object shapes but fails on deeply nested ones; a `Paths<T>` type that generates all dot-notation paths through an object; how libraries like ts-toolbelt navigate these limits at scale. What should a practicing TypeScript developer know about when to reach for recursive types and when to avoid them?

## Source priority (paste into research tool if it accepts source hints)
- https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/
- https://devblogs.microsoft.com/typescript/announcing-typescript-4-1/
