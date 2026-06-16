# Deep Research Prompt: Schema Refinements, Transforms, and TypeScript's Inference Limits

**Target tool**: Gemini Deep Research (or comparable)
**Intended use**: Audio-friendly content for NotebookLM
**Lesson**: openspec/changes/28-schema-production-patterns-and-limits/

## Prompt

Real-world schema validation rarely stops at "accept or reject" — it needs to transform accepted values into more precise types and add domain-specific constraints beyond what the structural type system can express. Investigate the design of refinements and transforms as first-class schema operations: what is the conceptual distinction between a refinement (narrows validity without changing the type) and a transform (changes the output type after parsing), and how did Zod's design evolve to capture this distinction cleanly? What motivated the introduction of the `_input` / `_output` split in schema types, and what class of programs are impossible to type correctly without it?

TypeScript's type system has hard limits — places where the inference algorithm gives up or produces unexpectedly wide types. Research these limits in the context of schema composition: what happens to type inference as schemas are chained through multiple transforms, what does the TypeScript compiler report when it hits a recursion limit in mapped types, and how does the checker signal when it has exhausted its instantiation budget? How do experienced TypeScript library authors use intermediate named type aliases to break the inference chain into digestible pieces? What is the `satisfies` operator's role as a verification tool that validates without widening — and how does it compare to explicit annotation in the context of schema composition?

The `tsc --diagnostics` flag and the TypeScript performance tracing tools expose the type-checking cost of complex schema graphs. Research what information these tools provide, how to interpret the instantiation count and type-check time metrics, and what the relationship is between type complexity and compile-time performance. What patterns produce the most expensive type-checking, and what refactors tend to fix compile-time performance without changing runtime behavior? How have major TypeScript-native libraries like Zod, tRPC, and Prisma approached the challenge of keeping both type complexity and compile-time cost manageable as their APIs have grown?

## Source priority (paste into research tool if it accepts source hints)
- https://zod.dev
- https://github.com/microsoft/TypeScript/wiki/Performance
- https://www.typescriptlang.org/tsconfig#diagnostics
- https://devblogs.microsoft.com/typescript/announcing-typescript-4-9/
