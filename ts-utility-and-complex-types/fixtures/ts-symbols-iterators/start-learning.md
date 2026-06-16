# Start Learning Fixture: TypeScript Symbols, Iterators, Iterables, Streams, and Cleanup

This fixture captures the `/start-learning` conversation for the TypeScript iteration ecosystem. It records scoping decisions, shape reasoning, and build-piece selection.

---

## Topic Confirmation

**Topic**: TypeScript — Symbols, Iterators, Iterables, Streams, and Cleanup

Confirmed scope: the JavaScript/TypeScript iteration protocols and their lifecycle — from `Symbol` primitives through async iteration, the Streams API, and the explicit resource management proposal. Excludes broader async patterns (Promise chains, RxJS/Observable), event emitters, and general concurrency.

---

## Scoping Answers

**Goal** (what fluency):
Deep mechanics. The learner wants to understand how the iterator and async-iterator protocols are designed — not just use `for...of`, but implement custom iterables from scratch, understand generator semantics precisely, and use the new disposal protocol confidently.

**Current baseline**:
Comfortable with TypeScript generics and `async/await`. Has used `for...of` and seen generator syntax (`function*`) but has never implemented `[Symbol.iterator]` by hand or written an async generator. Gets confused when generators throw vs. return. Has not used `Symbol.dispose` or `using` at all.

**Scope boundary**:
Stay tight on the iteration/cleanup lifecycle. Specifically include:
- `Symbol` primitives and well-known symbols
- Iterator and iterable protocols
- Generator functions (sync and async)
- Async iteration and `for await...of`
- Streams API (Node/browser)
- Explicit resource management (`using`, `Symbol.dispose`)

Explicitly exclude: Observables, event emitters, Promise combinators, worker threads.

**Framing / lens**: none

---

## Shape Decision

**Shape: hybrid**

Reasoning: The learner's goal is deep mechanics, which favors koans (controlled, mechanic-by-mechanic scenarios). But the async pipeline + cleanup pattern — where cancellation, backpressure, and disposal interact — only becomes clear when you build something. A pure-koan shape would leave that integration tacit. Hybrid: koans for each protocol in isolation, one build-piece lesson where they compose under real constraints.

---

## Build-Piece Selection

Three candidates presented:

**Option 1: Async iterable pipeline** — A composable pipeline class (`AsyncPipeline<T>`) that chains async iterables with `map`, `filter`, `take`, and `chunk` operations. Supports cancellation via `Symbol.asyncDispose` and `await using`. Exercises: iterator protocol, async generators, Symbol well-known symbols, disposal. Tradeoff: teaches the full scope well; doesn't exercise Streams API directly.

**Option 2: Readable stream wrapper** — A thin wrapper that converts a `ReadableStream` into an async iterable and vice versa, with backpressure management. Exercises: Streams API, async iteration, cancellation. Tradeoff: deeper on Streams; lighter on the pure iterator/generator mechanics.

**Option 3: Lazy sequence library** — A lazy `Seq<T>` that implements the sync iterable protocol with `map`, `filter`, `take`, `zip`, `flatMap`. Exercises: sync iteration and generators thoroughly; doesn't touch async or disposal.

**Selected: Option 1 — Async iterable pipeline.** Covers the widest surface of the syllabus: Symbol (well-known symbols for dispose), iterator protocol (implementing `[Symbol.asyncIterator]`), async generators (internal implementation), and the disposal protocol (cancellation via `await using`). Option 2 is a good follow-up for a Streams deep-dive; Option 3 is better suited for a pure-sync iteration topic.

---

## Decisions for Curriculum Design

- Shape: hybrid
- Build piece: async iterable pipeline (`AsyncPipeline<T>`) with `map`, `filter`, `take`, `chunk`, and `Symbol.asyncDispose` cancellation
- Lesson count target: 10–14
- Foundation koans before build piece: yes (all koan lessons before `12-async-pipeline`)
- Framing notes: none globally; lesson-level framing notes where protocol design choices benefit from comparison (iterator return type design, disposal vs. cancellation token pattern)
