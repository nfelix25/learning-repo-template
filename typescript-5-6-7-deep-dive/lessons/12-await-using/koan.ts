import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 12 — `await using` and AsyncDisposable                  [TS 5.2]
// ─────────────────────────────────────────────────────────────────────────
// MOTIVATION:
//   Synchronous `using` calls `[Symbol.dispose]()`. But many resources need
//   async teardown — flushing a write buffer, closing a socket gracefully,
//   committing a transaction. You can't `await` inside Symbol.dispose.
//
//   Enter `await using` + `AsyncDisposable`:
//
//     interface AsyncDisposable {
//       [Symbol.asyncDispose](): Promise<void>
//     }
//
//   With `await using`, TypeScript inserts an `await` before calling dispose:
//
//     await using conn = openDbConnection()
//     // At block exit: await conn[Symbol.asyncDispose]()
//
// RULES:
//   - `await using` can only appear in `async` functions
//   - The value must be `AsyncDisposable` (has [Symbol.asyncDispose]) OR
//     `Disposable` (has [Symbol.dispose]) — sync resources work in both
//   - Disposal still happens in LIFO order
//   - Errors still produce SuppressedError if both body and dispose throw
//
// WHEN TO USE async vs sync:
//
//   sync `using`:
//   - In-memory resources (caches, timers with clearTimeout, event listeners)
//   - Synchronous file handles (if the API supports it)
//   - Anything where cleanup is instantaneous
//
//   `await using`:
//   - DB connections (graceful shutdown, connection pool release)
//   - Network sockets (flush + close)
//   - Streams (wait for drain/end)
//   - Any cleanup that involves I/O
//
// AsyncDisposableStack:
//   Like DisposableStack but for async resources. `.defer(async () => ...)`.
//   Disposes all registered resources in reverse-registration order.
//
// COMBINING SYNC AND ASYNC:
//   `await using` can hold both sync Disposable and AsyncDisposable values.
//   When disposed, if the value has [Symbol.asyncDispose], that is used;
//   otherwise [Symbol.dispose] is called synchronously.
// ═══════════════════════════════════════════════════════════════════════════

// ── Shared setup ──────────────────────────────────────────────────────────

const asyncLog: string[] = []

function makeAsyncResource(name: string): AsyncDisposable {
  return {
    async [Symbol.asyncDispose]() {
      await Promise.resolve()  // simulate async teardown
      asyncLog.push(`async-disposed: ${name}`)
    }
  }
}

// ── Exercise A — implement an AsyncDisposable class ───────────────────────
// TODO: Add [Symbol.asyncDispose] to DbConnection so it can be used
// with `await using`.

class DbConnection {
  connected = true
  queryCount = 0

  async query(sql: string): Promise<unknown[]> {
    this.queryCount++
    return [{ sql }]
  }

  // TODO: implement [Symbol.asyncDispose]():
  //   await Promise.resolve()  — simulate async flush
  //   this.connected = false
  //   push "db-closed" to asyncLog
}

async function withDatabase(): Promise<unknown[]> {
  // TODO: replace with `await using conn = new DbConnection()`
  const conn = new DbConnection()
  const result = await conn.query("SELECT 1")
  return result
  // conn should be closed here automatically
}

type _A1 = Expect<Equal<ReturnType<typeof withDatabase>, Promise<unknown[]>>>

// ── Exercise B — LIFO order with async resources ──────────────────────────
// TODO: Rewrite this function using `await using` for both resources.
// Confirm disposal is LIFO: b disposed before a.

async function openMultiple(): Promise<void> {
  // TODO: await using a = makeAsyncResource("a")
  // TODO: await using b = makeAsyncResource("b")
  // After this block: asyncLog should end with ["async-disposed: b", "async-disposed: a"]
  makeAsyncResource("a")
  makeAsyncResource("b")
}

type _B1 = Expect<Equal<typeof asyncLog, string[]>>

// ── Exercise C — mixing sync and async disposables ───────────────────────
// `await using` can hold either AsyncDisposable or Disposable.
// TODO: In the same async function, open one sync and one async resource.

const mixedLog: string[] = []

function makeSyncResource(name: string): Disposable {
  return {
    [Symbol.dispose]() {
      mixedLog.push(`sync-disposed: ${name}`)
    }
  }
}

function makeAsyncRes(name: string): AsyncDisposable {
  return {
    async [Symbol.asyncDispose]() {
      mixedLog.push(`async-disposed: ${name}`)
    }
  }
}

async function mixedResources(): Promise<void> {
  // TODO: use both `using sync` and `await using async` in the same function
  // Disposal order: LIFO. Last declared is disposed first.
}

type _C1 = Expect<Equal<ReturnType<typeof mixedResources>, Promise<void>>>

// ── Exercise D — AsyncDisposableStack.defer ──────────────────────────────
// AsyncDisposableStack lets you compose multiple async resources.
// TODO: Use an AsyncDisposableStack to register two cleanup callbacks.

async function usingStack(): Promise<void> {
  // TODO:
  // await using stack = new AsyncDisposableStack()
  // stack.defer(async () => { asyncLog.push("stack-cleanup-1") })
  // stack.defer(async () => { asyncLog.push("stack-cleanup-2") })
  // Both run in LIFO when the block exits
}

type _D1 = Expect<Equal<ReturnType<typeof usingStack>, Promise<void>>>
