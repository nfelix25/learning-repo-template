// ─── k-043: Async Disposal — Symbol.asyncDispose / await using (TS 5.2) ───────
//
// The async counterpart to `using` is `await using`. It calls `[Symbol.asyncDispose]()`
// when the variable goes out of scope, and the disposal is awaited automatically.
//
//   await using conn = await openDbConnection()
//   // ... async work ...
//   // await conn[Symbol.asyncDispose]() called here
//
// The `AsyncDisposable` interface: `{ [Symbol.asyncDispose](): Promise<void> }`
// The `AsyncDisposableStack` utility mirrors `DisposableStack` for async resources.
//
// Typical use cases: database connections, file handles, HTTP clients, test fixtures
// that need async teardown (flushing buffers, closing streams, releasing locks).
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest"

// ── Part 1: AsyncDisposable ───────────────────────────────────────────────────
//
// `AsyncDbConnection` simulates an async database connection.
// Disposal is async (e.g., flushing a write buffer before closing).

class AsyncDbConnection implements AsyncDisposable {
  private _open = true
  readonly log: string[] = []

  async query(sql: string): Promise<string[]> {
    if (!this._open) throw new Error("Connection is closed")
    this.log.push(`query: ${sql}`)
    return [`result of ${sql}`]
  }

  readonly [Symbol.asyncDispose] = async (): Promise<void> => {
    await Promise.resolve()  // simulate async flush
    this._open = false
    this.log.push("connection closed")
  }
}

describe("AsyncDbConnection", () => {
  it("works before disposal", async () => {
    await using conn = new AsyncDbConnection()
    const results = await conn.query("SELECT 1")
    expect(results).toEqual(["result of SELECT 1"])
  })

  it("disposes at end of await using block", async () => {
    let c!: AsyncDbConnection
    {
      await using conn = new AsyncDbConnection()
      c = conn
      await conn.query("SELECT 1")
    }
    expect(c.log).toContain("connection closed")
    await expect(c.query("SELECT 2")).rejects.toThrow("Connection is closed")
  })

  it("disposes even when exception is thrown", async () => {
    let c!: AsyncDbConnection
    try {
      await using conn = new AsyncDbConnection()
      c = conn
      throw new Error("something went wrong")
    } catch {
      // swallow
    }
    expect(c.log).toContain("connection closed")
  })
})

// ── Part 2: AsyncDisposableStack ──────────────────────────────────────────────
//
// `AsyncDisposableStack` is the async version of `DisposableStack`.
// `.use()`, `.defer()` work the same way, but disposal is async and LIFO.

describe("AsyncDisposableStack", () => {
  it("disposes all resources in LIFO order", async () => {
    const order: number[] = []
    {
      await using stack = new AsyncDisposableStack()
      stack.defer(async () => order.push(1))
      stack.defer(async () => order.push(2))
      stack.defer(async () => order.push(3))
    }
    expect(order).toEqual([3, 2, 1])
  })

  it("use() registers an AsyncDisposable", async () => {
    let conn!: AsyncDbConnection
    {
      await using stack = new AsyncDisposableStack()
      conn = stack.use(new AsyncDbConnection())
      await conn.query("SELECT 1")
    }
    expect(conn.log).toContain("connection closed")
  })
})

// ── Part 3: Sync + Async disposables mixed ────────────────────────────────────
//
// You can mix `using` and `await using` in the same function.
// Sync disposables work with `using` (or can be adapted to async via Symbol.asyncDispose).
// `AsyncDisposableStack` can hold BOTH sync Disposable (via .use()) and async.

class SyncResource implements Disposable {
  readonly log: string[] = []

  readonly [Symbol.dispose] = (): void => {
    this.log.push("sync disposed")
  }
}

class AsyncResource implements AsyncDisposable {
  readonly log: string[] = []

  readonly [Symbol.asyncDispose] = async (): Promise<void> => {
    await Promise.resolve()
    this.log.push("async disposed")
  }
}

describe("mixed sync/async disposal", () => {
  it("both are disposed in correct order via AsyncDisposableStack", async () => {
    const syncR = new SyncResource()
    const asyncR = new AsyncResource()
    {
      await using stack = new AsyncDisposableStack()
      // defer can adapt sync to async context
      stack.defer(() => syncR[Symbol.dispose]())
      stack.use(asyncR)
    }
    expect(syncR.log).toContain("sync disposed")
    expect(asyncR.log).toContain("async disposed")
  })
})
