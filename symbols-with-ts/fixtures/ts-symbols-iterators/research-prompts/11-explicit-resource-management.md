# Deep Research Prompt: Explicit Resource Management

**Target tool**: Gemini Deep Research (or comparable)
**Intended use**: Audio-friendly content for NotebookLM
**Lesson**: fixtures/ts-symbols-iterators/scaffold/openspec/changes/11-explicit-resource-management/

## Prompt

Every language that deals with external resources — files, database connections, locks, sockets — must answer the same question: how do you guarantee cleanup even when things go wrong? Research the history of resource management patterns across languages: RAII in C++ (constructors acquire, destructors release), `try-with-resources` in Java, the `using` statement in C#, `with` in Python, `defer` in Go. What design philosophies underlie each? What tradeoffs did each language make between ergonomics, safety, and complexity?

JavaScript's answer — the TC39 explicit resource management proposal (stage 4, TypeScript 5.2, Node 20.4) — arrived late. Why did JavaScript manage without a language-level resource management primitive for so long? The `try/finally` pattern has always existed; what does `using` add beyond syntactic convenience? Focus on the cases where `finally` is insufficient or awkward: multiple resources with dependent cleanup, resources acquired inside loops, async cleanup in generators. The proposal's `DisposableStack` and `AsyncDisposableStack` address composite cleanup — explore why LIFO ordering matters and how it mirrors the acquisition order.

Cover the error suppression semantics: when the block throws and `dispose()` also throws, the block's error wins and the disposal error is attached but suppressed. Compare this to Python's context manager exception chaining and Java's suppressed exceptions. Why did the committee choose suppression over re-throwing? What are the practical consequences for library authors implementing `Symbol.dispose`?

## Source priority (paste into research tool if it accepts source hints)
- https://tc39.es/proposal-explicit-resource-management/
- https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html
- https://nodejs.org/api/globals.html#using-in-nodejs
