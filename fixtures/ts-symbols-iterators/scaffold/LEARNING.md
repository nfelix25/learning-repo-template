# Learning Project: TypeScript Symbols, Iterators, Iterables, Streams, and Cleanup

**Created**: 2026-05-23
**Topic**: TypeScript Symbols, Iterators, Iterables, Streams, and Cleanup
**Goal**: Deep mechanics fluency — implement custom iterables and async iterables from scratch, understand generator semantics precisely (including cleanup via return/throw), and use the explicit resource management protocol (using / await using) confidently in real code.
**Framing/Lens**: none
**Shape**: hybrid
**Build piece**: AsyncPipeline<T> — composable async iterable pipeline with Symbol.asyncDispose cancellation

## Scoping answers
- End goal: deep mechanics (understand the protocol design, not just usage)
- Current baseline: comfortable with async/await and for...of; has seen generators but never implemented Symbol.iterator by hand; no experience with Symbol.dispose or using
- Scope boundary: iteration and cleanup lifecycle; excludes Observables, event emitters, Promise combinators, worker threads

## Notes
Async generators (lesson 09) are a prerequisite for both Streams (10) and the build piece (12). The explicit resource management lesson (11) is frontier — verify TypeScript and Node versions before applying.
