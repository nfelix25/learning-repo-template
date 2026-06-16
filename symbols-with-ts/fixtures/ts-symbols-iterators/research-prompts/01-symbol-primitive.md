# Deep Research Prompt: Symbol Primitive

**Target tool**: Gemini Deep Research (or comparable)
**Intended use**: Audio-friendly content for NotebookLM
**Lesson**: fixtures/ts-symbols-iterators/scaffold/openspec/changes/01-symbol-primitive/

## Prompt

JavaScript has had five primitive types since its inception — number, string, boolean, null, undefined. In 2015, ES6 added a sixth: Symbol. Research the motivations behind this addition. Why wasn't a string-keyed convention (like `__id__` or prefixed names) sufficient? What problem does guaranteed uniqueness solve in a language where objects are open and any code can add properties to any object? Focus on the design rationale rather than the syntax — the interesting story is why the language needed a new kind of value at all.

Explore how Symbols relate to the extensibility of built-in protocols. Before Symbols, adding a new method to a prototype risked colliding with names that user code had already claimed. Describe how well-known Symbols solve this by creating a named but un-clobberable extension point. Cover the global Symbol registry (`Symbol.for` / `Symbol.keyFor`) and explain why the two-tier system (local unique + global named) exists — what use cases does each serve?

Touch on what Symbols are NOT: they are not object identity markers (objects already have reference identity), not truly private (reflection APIs expose them), and not a security boundary. What are they exactly good for, and where do developers sometimes reach for them when a different tool would be better?

## Source priority (paste into research tool if it accepts source hints)
- https://tc39.es/ecma262/#sec-symbol-objects
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
