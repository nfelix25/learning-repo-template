# Deep Research Prompt: React TypeScript Patterns — Polymorphism, Refs, and the Evolution of Component Typing

**Target tool**: Gemini Deep Research (or comparable)
**Intended use**: Audio-friendly content for NotebookLM
**Lesson**: openspec/changes/18-react-type-patterns/

## Prompt

React's TypeScript types have always been one of the most complex type definitions in the JavaScript ecosystem. Research the design challenges that make React components hard to type correctly. Start with the polymorphic component problem: a `Button` that can render as a `<button>`, `<a>`, or any other element — and should automatically expose the correct props for whichever element it renders as. Why is this hard? What TypeScript features are needed to express it, and why did it take until generics-in-JSX became practical before this pattern could be written cleanly?

Explore the history and evolution of `forwardRef`. Why was it introduced? What problem does forwarding refs solve at the React level, and why did that solution create typing complexity at the TypeScript level? The `forwardRef` API required a complex generic wrapper in `@types/react`, and that wrapper caused ongoing pain around generic components and prop inference. React 19's decision to deprecate `forwardRef` in favor of `ref` as a plain prop simplifies the story significantly — research what changed, why it was possible to change, and what the migration path looks like for existing React 18 codebases.

Touch on the broader theme: React's API has repeatedly run ahead of TypeScript's ability to express it cleanly. Generic JSX components, discriminated union props, HOC typing — each required specific TypeScript features to reach ergonomic solutions. What does this reveal about the relationship between framework API design and type system capabilities? What would a React API designed *for* TypeScript look like, compared to one that TypeScript had to adapt to?

## Source priority (paste into research tool if it accepts source hints)
- https://react.dev/blog/2024/12/05/react-19
- https://react.dev/reference/react/forwardRef
- https://react.dev/learn/typescript
