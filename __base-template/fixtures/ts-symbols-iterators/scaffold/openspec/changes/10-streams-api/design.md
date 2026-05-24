## Content manifest

### Outline

**Intro**: The Streams API is the platform-level answer to streaming data. Unlike the iterator protocols you've built by hand, Streams are objects you compose from primitives. The key bridge: `ReadableStream` implements `Symbol.asyncIterator`, so everything you know about `for await...of` applies.

**Mechanic**:
- `ReadableStream` — a source of data chunks. Created with a `UnderlyingSource` that calls `controller.enqueue()`.
- `WritableStream` — a sink. Processes chunks in its `write()` handler.
- `TransformStream` — a `{ readable, writable }` pair. Data flows in via `writable`, transformed data emerges from `readable`.
- `pipeTo(writable)` — connects a readable to a writable, with backpressure respected.
- `pipeThrough(transform)` — inserts a `TransformStream` in the chain.
- `ReadableStream[Symbol.asyncIterator]()` — consume any readable with `for await...of`.
- Backpressure: `controller.desiredSize` signals how much buffer space remains; producers should pause when this goes negative.

**Worked example**: Create a `ReadableStream` of strings. Create a `TransformStream` that uppercases each chunk. Pipe through the transform, then consume with `for await...of`. Show the backpressure signal from `desiredSize`.

**Pitfalls**: Two readers from the same stream conflict (use `.tee()` to branch). `for await...of` locks the stream's reader — don't mix with `getReader()`. `desiredSize` is advisory, not enforced.

**Exercise**: Build a `ChunkCounter` `TransformStream` that passes chunks through unchanged and emits a count on each transform call.

### Sources

See `sources.md`.

### Version note

Requires Node.js 18+ for full Web Streams support; Node 20+ for stable `Symbol.asyncIterator` on `ReadableStream`.
