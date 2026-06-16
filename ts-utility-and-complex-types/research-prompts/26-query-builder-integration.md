# Deep Research Prompt: Type-Level Design — Patterns That Generalize Beyond the Query Builder

**Target tool**: Gemini Deep Research (or comparable)
**Intended use**: Audio-friendly content for NotebookLM
**Lesson**: openspec/changes/26-query-builder-integration/

## Prompt

Building a typed query builder from scratch requires solving a sequence of type-level problems: schema encoding, projection, string DSL generation, recursive predicate types, state threading, result inference. Research what these solutions have in common — the abstract patterns underneath the specific implementation. Schema-encoded types (where a type-level value describes a data structure that the type system can reason about) appear in many places beyond databases: HTTP route definitions, form schemas, API contracts, event maps. What makes "encoding a schema in the type system" a powerful pattern, and what are its limits?

Explore the concept of "phantom types" or "type tags" — types that carry information at the type level with no runtime representation — and where this pattern generalizes. The `QueryState` type that accumulates builder configuration is a phantom type: it exists only to inform the type checker, not to do runtime work. How does this relate to branded types, opaque type aliases, and the broader theme of making invalid states unrepresentable?

Touch on the performance dimension of complex type systems. TypeScript measures type checking time, and complex conditional/recursive types can meaningfully slow the language server. Research how TypeScript's team thinks about this tradeoff, what tools exist for measuring type checking performance (e.g., `--extendedDiagnostics`, `tsc --generateTrace`), and what techniques library authors use to keep complex types fast. What is the difference between types that are complex to write and types that are expensive to check — and what makes one type more expensive than another?

End with the meta-lesson: what should a TypeScript developer carry forward from building something like a typed query builder? Not the specific types, which will rot as APIs change, but the design instincts — when to encode information in the type system, when to leave it to runtime, and how to tell the difference.

## Source priority (paste into research tool if it accepts source hints)
- https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
- https://www.typescriptlang.org/tsconfig
