# Deep Research Prompt: Overloads vs. Generics

**Target tool**: Gemini Deep Research (or comparable)
**Intended use**: Audio-friendly content for NotebookLM
**Lesson**: openspec/changes/17-overloads-vs-generics/

## Prompt

Both function overloads and generic type parameters can encode "this function behaves differently depending on what type you pass in" — but they represent fundamentally different approaches with different expressive power and different failure modes. Investigate the design origins of function overloads in TypeScript: where did the overload declaration syntax come from, how does it relate to overloads in other languages like C++ and Java, and what was the intended use case in TypeScript's structural type system where method dispatch doesn't actually happen at runtime?

The practical question of when to use overloads versus generics is something every TypeScript author eventually faces, and the answer is not always obvious. Research the cases where generics are strictly superior — where the relationship between input and output types is expressible as a type-level function — and the cases where overloads are the better tool, particularly when conditional or discriminated types produce poor inference in practice. What happens to IntelliSense and error message quality as overload lists grow? What are the documented failure modes of complex generic signatures, such as when the checker falls back to `unknown` because it can't unify inference candidates?

TypeScript's own standard library uses both approaches in revealing ways. Explore how the `lib.d.ts` types for functions like `Array.prototype.reduce`, `Promise.all`, and `JSON.parse` evolved over time — where the library authors chose overloads, where they chose generics, and in some cases where they switched from one to the other. What does this history reveal about the ergonomics and limitations of each approach at scale? How have library authors in DefinitelyTyped and in major TypeScript-native libraries like Zod, tRPC, and Prisma navigated this choice?

## Source priority (paste into research tool if it accepts source hints)
- https://www.typescriptlang.org/docs/handbook/2/functions.html
- https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html
- https://github.com/microsoft/TypeScript/wiki/TypeScript-Design-Goals
