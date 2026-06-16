# Deep Research Prompt: Type-Level State Machines — The Builder Pattern at the Type Level

**Target tool**: Gemini Deep Research (or comparable)
**Intended use**: Audio-friendly content for NotebookLM
**Lesson**: openspec/changes/23-query-builder-chained-builder/

## Prompt

The builder pattern is well-known in object-oriented design — a fluent API that accumulates configuration through method chains before executing. What is less often explored is using TypeScript's type system to make the builder not just ergonomic but *correct*: encoding which methods have been called, which are now required, and which are now forbidden, all at the type level without any runtime overhead.

Research the concept of type-level state machines. How do you use TypeScript generics to thread state through a chain of method calls, where each method returns a new type that reflects the updated state? The key insight is that each method must return a new parameterized type rather than `this` — explore why `this` is insufficient and what type information is lost when you return `this` instead of a precisely typed new instance.

Explore real-world examples of this pattern: SQL query builders like Kysely, which pioneered type-safe chainable SQL in TypeScript; form builders; pipeline builders. What design tradeoffs do library authors face when choosing how much state to encode in the type vs. leaving validation to runtime? Where does the type-level state machine pattern become too expensive (in terms of TypeScript compile time and developer ergonomics) to be worthwhile, and what are the simpler alternatives?

Touch on the relationship between this pattern and type-safe state machines more broadly. Libraries like XState v5 use similar techniques to encode valid state transitions at the type level. What general principle connects the query builder, the form builder, and the state machine? What should a TypeScript developer understand about phantom types — types that carry information at the type level but have no runtime representation — and when they are the right tool?

## Source priority (paste into research tool if it accepts source hints)
- https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
- https://www.typescriptlang.org/docs/handbook/2/generics.html
