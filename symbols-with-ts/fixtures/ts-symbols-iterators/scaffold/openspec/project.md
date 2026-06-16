# Project Context

## Topic
TypeScript Symbols, Iterators, Iterables, Streams, and Cleanup

## Goal
Deep mechanics fluency — implement custom iterables and async iterables from scratch, understand generator semantics precisely (including cleanup via return/throw), and use the explicit resource management protocol (`using` / `await using`) confidently in real code.

## Framing / Lens
none

## Shape
hybrid; build piece: AsyncPipeline<T> — composable async iterable pipeline with Symbol.asyncDispose cancellation

## Tech stack
- TypeScript 5.4+ strict (5.2+ required for `using` / `await using`)
- Vitest 1.x
- Node 20.4+ (required for `using` in Node globals)

## Conventions
- Lesson directories: `lessons/{NN-name}/`
- Each lesson contains: `lesson.md`, `{topic}.test.ts`, `{topic}.ts` (workspace)
- Type-level tests via `expectTypeOf` (Vitest built-in)
- Tests are additive — all tests stay live as lessons are added
- Run full suite: `vitest`; filter to one lesson: `vitest -t "Lesson NN"`
- Frontier lesson (11): include version compatibility note at top of lesson.md

## Syllabus (canonical)

lessons:
  - id: 01-symbol-primitive
    depends_on: []
    type: koan
    currency: stable
    audio_value: high
    estimated_minutes: 35
    concepts:
      - Symbol() creates a unique, non-string primitive
      - Symbol description is for debugging, not identity
      - Symbol.for() and Symbol.keyFor() for global registry
      - Symbols are not enumerable in for...in or Object.keys
      - Symbol as unique object property key (collision-free)

  - id: 02-well-known-symbols
    depends_on: [01-symbol-primitive]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 40
    concepts:
      - Symbol.iterator — marks an object as sync iterable
      - Symbol.asyncIterator — marks an object as async iterable
      - Symbol.toPrimitive — controls type coercion
      - Symbol.hasInstance — customizes instanceof
      - Symbol.toStringTag — customizes Object.prototype.toString
      - Well-known symbols as extension points for built-in protocols

  - id: 03-iterator-protocol
    depends_on: [02-well-known-symbols]
    type: koan
    currency: stable
    audio_value: high
    estimated_minutes: 45
    concepts:
      - Iterator interface — next() returns IteratorResult<T>
      - IteratorResult shape — { value, done }
      - Optional return() — iterator cleanup on early exit
      - Optional throw() — injecting errors into the iterator
      - Iterator contract — once done, always done

  - id: 04-iterable-protocol
    depends_on: [03-iterator-protocol]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 40
    concepts:
      - Iterable interface — [Symbol.iterator]() returns an Iterator
      - for...of desugaring
      - Spread syntax on iterables
      - Destructuring assignment from iterables
      - Array.from() on custom iterables
      - Iterator-iterables (return this from [Symbol.iterator])

  - id: 05-generator-functions
    depends_on: [04-iterable-protocol]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 50
    concepts:
      - function* syntax
      - yield pauses execution and emits a value
      - Generator objects implement Iterator and Iterable
      - Lazy evaluation
      - yield* delegates to another iterable
      - next(value) sends a value back into a paused generator

  - id: 06-generator-return-and-throw
    depends_on: [05-generator-functions]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 45
    concepts:
      - Generator.prototype.return(value)
      - Generator.prototype.throw(error)
      - try/finally in generators runs on return() or throw()
      - return value of a generator function
      - Cleanup in generators via try/finally

  - id: 07-lazy-sequences
    depends_on: [05-generator-functions]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 40
    concepts:
      - Infinite iterables
      - take(n) — materializing a prefix of a lazy sequence
      - map and filter as generator adapters
      - Composing iterators without intermediate arrays
      - Memory characteristics of lazy vs. eager evaluation

  - id: 08-async-iterator-protocol
    depends_on: [03-iterator-protocol]
    type: koan
    currency: stable
    audio_value: high
    estimated_minutes: 45
    concepts:
      - AsyncIterator interface — next() returns Promise<IteratorResult<T>>
      - Symbol.asyncIterator
      - for await...of
      - AsyncIterator return() and throw() are async
      - Async iteration contract

  - id: 09-async-generators
    depends_on: [08-async-iterator-protocol, 06-generator-return-and-throw]
    type: koan
    currency: stable
    audio_value: medium
    estimated_minutes: 45
    concepts:
      - async function* syntax
      - yield in async context
      - await inside async generators
      - async generators implement AsyncIterator and AsyncIterable
      - Error handling in async generators
      - Combining await and yield

  - id: 10-streams-api
    depends_on: [09-async-generators]
    type: koan
    currency: versioned
    audio_value: medium
    estimated_minutes: 60
    concepts:
      - ReadableStream
      - WritableStream
      - TransformStream
      - pipeTo() and pipeThrough()
      - ReadableStream[Symbol.asyncIterator]()
      - Backpressure

  - id: 11-explicit-resource-management
    depends_on: [02-well-known-symbols]
    type: koan
    currency: frontier
    audio_value: high
    estimated_minutes: 50
    concepts:
      - Symbol.dispose
      - Symbol.asyncDispose
      - using declaration
      - await using declaration
      - DisposableStack and AsyncDisposableStack
      - Disposal ordering — LIFO
      - Error suppression rules during disposal

  - id: 12-async-pipeline
    depends_on: [09-async-generators, 11-explicit-resource-management]
    type: build_piece
    currency: stable
    audio_value: low
    estimated_minutes: 90
    concepts:
      - Implementing AsyncIterable<T> from scratch
      - Composable pipeline
      - map, filter, take, chunk as async generator adapters
      - Cancellation via Symbol.asyncDispose
      - await using in the pipeline driver
      - Type safety through transformations
    build_piece_role: |
      The complete AsyncPipeline<T> class with map, filter, take, chunk,
      and DisposableAsyncPipeline cancellation support.
