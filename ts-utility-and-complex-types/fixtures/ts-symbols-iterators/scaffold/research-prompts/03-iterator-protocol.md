# Deep Research Prompt: Iterator Protocol

**Target tool**: Gemini Deep Research (or comparable)
**Intended use**: Audio-friendly content for NotebookLM
**Lesson**: fixtures/ts-symbols-iterators/scaffold/openspec/changes/03-iterator-protocol/

## Prompt

The iterator protocol is one of the most influential design decisions in modern JavaScript. Research the design rationale behind the `{ value, done }` result shape. Why not return the value directly and use a sentinel (like `null` or `undefined`) to signal completion? Why not throw when exhausted? The design choices have subtle but important consequences — especially the ability to have a typed return value when done is true — and understanding the tradeoffs illuminates how protocol designers think about edge cases and composability.

Explore the pull-based nature of the protocol: the consumer drives iteration by calling `next()`. Contrast this with push-based designs (callbacks, event emitters, Observables). What are the tradeoffs? Pull-based iteration is synchronous and composable; push-based is better suited for sources that produce values independently of consumer demand. How did the ECMAScript committee decide to standardize on pull for the iteration protocol, and where does the async version (covered in a later lesson) change that calculus?

Cover the optional `return()` and `throw()` methods. Why are they optional? What real-world scenarios require them? Focus on the concept of resource cleanup — what happens when a consumer abandons an iteration early (via `break`, `return`, or exception)? This is the story of why iterators need a way to be "cancelled" and how the protocol provides for it without mandating it for simple cases.

## Source priority (paste into research tool if it accepts source hints)
- https://tc39.es/ecma262/#sec-iterator-interface
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
