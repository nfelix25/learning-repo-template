# Deep Research Prompt: Async Iterator Protocol

**Target tool**: Gemini Deep Research (or comparable)
**Intended use**: Audio-friendly content for NotebookLM
**Lesson**: fixtures/ts-symbols-iterators/scaffold/openspec/changes/08-async-iterator-protocol/

## Prompt

The async iterator protocol is the sync iterator protocol with one key change: `next()` returns a Promise. Research why this minimal change — keeping the pull-based model but making each pull asynchronous — was chosen over alternatives. There were other candidates: callback-based iteration (Node.js streams original API), push-based async iteration (Observable/RxJS), and async generators. Why did the committee standardize on `for await...of` and the async iterator shape rather than a push-based model?

Explore the ordering guarantee that async iteration provides: values are produced in sequence, and the consumer processes them in order. Contrast this with `Promise.all` or concurrent event handling. What does the async iterator protocol give up in exchange for that ordering? When is sequentiality a feature (reading a file line by line) and when is it a constraint (processing independent parallel chunks)?

Cover how Node.js `Readable` streams and the WHATWG `ReadableStream` expose themselves as async iterables. What was the motivation for this bridge? What are the practical implications of consuming a stream via `for await...of` versus using stream events or `.pipe()`? The story here is about the unification of historically divergent async I/O APIs under a single protocol — what that unification cost and what it gained.

## Source priority (paste into research tool if it accepts source hints)
- https://tc39.es/ecma262/#sec-asynciterator-interface
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncIterator
