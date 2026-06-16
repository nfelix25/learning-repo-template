# Deep Research Prompt: Distributive Conditional Types

**Target tool**: Gemini Deep Research (or comparable)
**Intended use**: Audio-friendly content for NotebookLM
**Lesson**: openspec/changes/07-distributive-conditionals/

## Prompt

TypeScript's conditional types have a feature that surprises nearly every developer who first encounters it: when you write `T extends U ? X : Y` with a generic type parameter `T`, the type doesn't just evaluate once — it maps over every member of a union. Research the design rationale for this behavior. Why was distributing over unions chosen as the default? What problem does it solve that wasn't already solved by mapped types? The interesting story is not the syntax, but the motivation: what class of type transformations became possible that were impossible before, and what made those transformations so important to the designers of TypeScript's type system?

Explore what "naked type parameter" means in this context and why the wrapping behavior (`[T] extends [U]`) exists as an escape hatch. What does it mean for a type parameter to be "naked," and what changes about evaluation when it's wrapped? The existence of an explicit opt-out mechanism reveals something about the design tradeoffs — discuss what those are.

Touch on how distributive conditional types relate to the behavior of `Exclude` and `Extract` — these aren't special built-ins but ordinary conditional types that work because distribution is the default. What does that reveal about the design philosophy? And what are the common practical mistakes developers make when they encounter unexpected distribution (or unexpected non-distribution), and how do you develop the intuition to reason through it?

## Source priority (paste into research tool if it accepts source hints)
- https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
- https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
