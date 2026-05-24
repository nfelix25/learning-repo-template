## Content manifest

### Architecture

`AsyncPipeline<T>` wraps an `AsyncIterable<T>` and exposes chainable operations that each return a new `AsyncPipeline<U>`. The pipeline is lazy — no iteration happens until a consumer drives it with `for await...of`.

`DisposableAsyncPipeline<T>` extends `AsyncPipeline<T>` with `Symbol.asyncDispose`. Disposing sends an abort signal to all stages via an `AbortController`. Each pipeline stage checks the signal and stops yielding when it fires.

### API surface (from specs/async-pipeline/spec.md)

- `new AsyncPipeline<T>(source: AsyncIterable<T>)`
- `.map<U>(fn: (value: T) => U | Promise<U>): AsyncPipeline<U>`
- `.filter(pred: (value: T) => boolean | Promise<boolean>): AsyncPipeline<T>`
- `.take(n: number): AsyncPipeline<T>`
- `.chunk(size: number): AsyncPipeline<T[]>`
- `[Symbol.asyncIterator](): AsyncIterator<T>`
- `new DisposableAsyncPipeline<T>(source: AsyncIterable<T>)` — extends `AsyncPipeline<T>`
- `[Symbol.asyncDispose](): Promise<void>` — aborts the pipeline

### Outline

**Intro**: Everything in this project — Symbols, the iterator protocol, async generators, disposal — was building toward this: a pipeline you can compose, type-check, and cancel.

**Mechanic**: Walk through the `AsyncPipeline` implementation step by step. Each method creates an async generator that consumes the previous stage. `map` applies the function to each item. `filter` drops items where the predicate returns false. `take` stops after `n` items. `chunk` accumulates items into arrays of `size`. `DisposableAsyncPipeline` holds an `AbortController`; `Symbol.asyncDispose` aborts it; each generator stage checks `signal.aborted` before yielding.

**Worked example**: Build a pipeline over an async data source (e.g., paginated results), map to extract a field, filter for a condition, take the first 10 matches. Show that `await using` on the pipeline stops the source before it's exhausted.

**Pitfalls**: Forgetting to thread the `AbortSignal` through all stages (only the outermost stage gets cancelled). Type inference breaking on `.map()` — TypeScript needs explicit generics when the return type changes. Chunking the last partial batch (don't drop it).

**Exercise**: Implement `AsyncPipeline` and `DisposableAsyncPipeline` from scratch, driven by the test suite.
