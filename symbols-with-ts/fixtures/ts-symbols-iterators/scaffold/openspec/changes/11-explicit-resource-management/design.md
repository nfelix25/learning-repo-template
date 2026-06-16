## Content manifest

### Outline

**Intro**: Every language that deals with external resources must answer: how do you guarantee cleanup even when things go wrong? JavaScript now has a language-level answer — `using` and `await using` — backed by `Symbol.dispose` and `Symbol.asyncDispose`.

**Mechanic**:
- `Symbol.dispose` — implement `[Symbol.dispose]()` on any object to make it synchronously disposable.
- `using x = expr` — calls `x[Symbol.dispose]()` at block exit (normal or exception). Like `try/finally` but scoped.
- `Symbol.asyncDispose` — the async variant: `[Symbol.asyncDispose]()` returns a Promise.
- `await using x = expr` — calls `await x[Symbol.asyncDispose]()` at block exit.
- `DisposableStack` — composite disposal: call `.use(resource)` to register resources; stack disposes in LIFO order.
- `AsyncDisposableStack` — same for async disposables.
- Error handling: if the block throws AND `dispose()` throws, the block's error wins; disposal error is suppressed (attached as `.suppressed`).

**Worked example**: Wrap a mock async database connection with `Symbol.asyncDispose`. Use `await using conn = getConnection()` in a test helper. Show that disposal fires even when the query throws. Then use `AsyncDisposableStack` to manage three resources — verify LIFO cleanup order.

**Pitfalls**: Omitting `await` before `using` for async disposables (TypeScript catches this, but the error message can be confusing). Expecting suppressed errors to propagate. Polyfilling `using` in older environments (it requires `Symbol.dispose` in the global).

**Exercise**: Implement a `MockFileHandle` that implements `Symbol.asyncDispose` and logs when closed. Write a test that verifies `await using` closes the handle on both normal exit and exception.

### Sources

See `sources.md`.

### Version note

TypeScript 5.2+ required. Node.js 20.4+ required. `DisposableStack` and `AsyncDisposableStack` are global in Node 20.4+.
