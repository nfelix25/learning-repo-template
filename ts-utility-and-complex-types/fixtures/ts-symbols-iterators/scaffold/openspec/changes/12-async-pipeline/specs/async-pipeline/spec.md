## ADDED Requirements

### Requirement: AsyncPipeline Wraps An AsyncIterable
`AsyncPipeline<T>` SHALL accept any `AsyncIterable<T>` as its source and implement `AsyncIterable<T>` itself.

#### Scenario: Pipeline Is Iterable
- **WHEN** a consumer iterates an `AsyncPipeline<T>` with `for await...of`
- **THEN** it receives the same values as iterating the source directly (with no operations applied).

### Requirement: map Transforms Values
`AsyncPipeline<T>.map<U>(fn)` SHALL return an `AsyncPipeline<U>` that applies `fn` to each value, supporting both sync and async `fn`.

#### Scenario: map Applies Sync Transformation
- **WHEN** `.map(x => x * 2)` is applied to a pipeline of numbers
- **THEN** the consumer receives each number doubled.

#### Scenario: map Applies Async Transformation
- **WHEN** `.map(async x => await fetchDetails(x))` is applied
- **THEN** each value is awaited before being yielded to the consumer.

### Requirement: filter Drops Non-Matching Values
`AsyncPipeline<T>.filter(pred)` SHALL return an `AsyncPipeline<T>` that only yields values where `pred` returns true.

#### Scenario: filter Skips Non-Matching Items
- **WHEN** `.filter(x => x % 2 === 0)` is applied to a sequence of integers
- **THEN** only even numbers are yielded.

### Requirement: take Limits Output Count
`AsyncPipeline<T>.take(n)` SHALL return an `AsyncPipeline<T>` that yields at most `n` values then stops.

#### Scenario: take Terminates After n Items
- **WHEN** `.take(3)` is applied to an infinite source
- **THEN** exactly 3 values are yielded and iteration ends.

### Requirement: chunk Groups Values Into Arrays
`AsyncPipeline<T>.chunk(size)` SHALL return an `AsyncPipeline<T[]>` that groups consecutive values into arrays of at most `size` elements.

#### Scenario: chunk Groups Full Batches
- **WHEN** `.chunk(3)` is applied to a 9-item source
- **THEN** three arrays of 3 items each are yielded.

#### Scenario: chunk Yields Partial Final Batch
- **WHEN** `.chunk(3)` is applied to a 10-item source
- **THEN** three arrays of 3 and one array of 1 are yielded (the partial batch is not dropped).

### Requirement: DisposableAsyncPipeline Supports Cancellation
`DisposableAsyncPipeline<T>` SHALL extend `AsyncPipeline<T>` and implement `Symbol.asyncDispose`. Disposing SHALL abort the pipeline, causing active iteration to stop before the source is exhausted.

#### Scenario: Disposal Stops Iteration
- **WHEN** a consumer creates `await using p = new DisposableAsyncPipeline(infiniteSource)` and the block exits early
- **THEN** the source stops yielding values (receives the cancellation signal).

#### Scenario: Explicit Dispose Stops Iteration Mid-Stream
- **WHEN** a consumer calls `await p[Symbol.asyncDispose]()` while iterating
- **THEN** the ongoing `for await...of` terminates before the source is exhausted.
