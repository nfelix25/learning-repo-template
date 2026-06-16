// ─── k-042: using and Symbol.dispose (TypeScript 5.2) ────────────────────────
//
// TypeScript 5.2 introduced the `using` declaration, based on the TC39 "Explicit
// Resource Management" proposal. When a `using` variable goes out of scope
// (normally or via exception), its `[Symbol.dispose]()` method is called
// automatically — like C++ RAII or Python's `with` statement.
//
//   using file = openFile("data.txt")
//   // ... work with file ...
//   // file[Symbol.dispose]() called here automatically
//
// The `Disposable` interface: `{ [Symbol.dispose](): void }`
// The `DisposableStack` utility: collect multiple disposables and dispose all at once.
//
// Key insight: `using` is scoped to the containing block/function.
// If an error is thrown inside the block, disposal STILL happens (like finally).
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest"

// ── Part 1: Basic Disposable ──────────────────────────────────────────────────
//
// Implement a `Timer` class that records its own creation/disposal times.
// Uses the Disposable interface so it works with `using`.

class Timer implements Disposable {
  private _start: number
  private _end: number | null = null

  constructor() {
    this._start = Date.now()
  }

  get elapsed(): number | null {
    return this._end !== null ? this._end - this._start : null
  }

  [Symbol.dispose](): void {
    this._end = Date.now()
  }
}

describe("Timer Disposable", () => {
  it("dispose records end time", () => {
    const t = new Timer()
    expect(t.elapsed).toBeNull()
    t[Symbol.dispose]()
    expect(t.elapsed).toBeGreaterThanOrEqual(0)
  })
  it("using keyword disposes at end of block", () => {
    let t!: Timer
    {
      using timer = new Timer()
      t = timer
    }
    expect(t.elapsed).not.toBeNull()
  })
})

// ── Part 2: Resource that needs cleanup ───────────────────────────────────────
//
// A `MockConnection` simulates a database connection.
// It tracks whether it's open, and `[Symbol.dispose]()` closes it.
// Once disposed, methods should throw.

class MockConnection implements Disposable {
  private _open = true
  readonly log: string[] = []

  query(sql: string): string[] {
    if (!this._open) throw new Error("Connection is closed")
    this.log.push(`query: ${sql}`)
    return [`result of ${sql}`]
  }

  [Symbol.dispose](): void {
    this._open = false
    this.log.push("connection closed")
  }
}

describe("MockConnection Disposable", () => {
  it("works normally before disposal", () => {
    using conn = new MockConnection()
    const results = conn.query("SELECT 1")
    expect(results).toEqual(["result of SELECT 1"])
  })
  it("disposes at end of block", () => {
    let c!: MockConnection
    {
      using conn = new MockConnection()
      c = conn
      conn.query("SELECT 1")
    }
    expect(c.log).toContain("connection closed")
    expect(() => c.query("SELECT 2")).toThrow("Connection is closed")
  })
  it("disposes even when exception is thrown", () => {
    let c!: MockConnection
    try {
      using conn = new MockConnection()
      c = conn
      throw new Error("something went wrong")
    } catch {
      // swallow
    }
    expect(c.log).toContain("connection closed")
  })
})

// ── Part 3: DisposableStack ───────────────────────────────────────────────────
//
// `DisposableStack` collects multiple disposables and disposes them in LIFO order.
// `.use(resource)` registers a Disposable.
// `.defer(fn)` registers a cleanup callback.
// The stack itself is Disposable — `using stack = new DisposableStack()` works.

describe("DisposableStack", () => {
  it("disposes all resources in LIFO order", () => {
    const order: number[] = []
    {
      using stack = new DisposableStack()
      stack.defer(() => order.push(1))
      stack.defer(() => order.push(2))
      stack.defer(() => order.push(3))
    }
    expect(order).toEqual([3, 2, 1])  // LIFO
  })

  it("use() registers a Disposable", () => {
    let conn!: MockConnection
    {
      using stack = new DisposableStack()
      conn = stack.use(new MockConnection())
      conn.query("SELECT 1")
    }
    expect(conn.log).toContain("connection closed")
  })
})

// ── Part 4: Factory function returning a Disposable ───────────────────────────
//
// Often you want a plain function that returns a `Disposable` object —
// without needing a full class. This is the "disposable object" pattern.

function withTempLog(label: string): Disposable & { entries: string[] } {
  const entries: string[] = []
  entries.push(`[${label}] start`)
  return {
    entries,
    [Symbol.dispose]() {
      entries.push(`[${label}] end`)
    },
  }
}

describe("disposable factory function", () => {
  it("logs start and end", () => {
    let log!: string[]
    {
      using temp = withTempLog("test")
      log = temp.entries
      temp.entries.push("[test] doing work")
    }
    expect(log).toEqual(["[test] start", "[test] doing work", "[test] end"])
  })
})
