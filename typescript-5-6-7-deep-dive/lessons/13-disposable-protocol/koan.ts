import type { Expect, Equal, Extends } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 13 — Disposable Protocol Design                         [TS 5.2]
// ─────────────────────────────────────────────────────────────────────────
// Now that you can USE `using`, how do you DESIGN well with it?
//
// THE PROTOCOL:
//   The TC39 proposal defines two interfaces:
//
//     interface Disposable      { [Symbol.dispose]():  void         }
//     interface AsyncDisposable { [Symbol.asyncDispose](): Promise<void> }
//
//   Any class or object implementing these can be used with `using`/`await using`.
//
// DisposableStack:
//   A built-in class for composing multiple disposables:
//
//     using stack = new DisposableStack()
//     stack.use(resource1)          // register an existing Disposable
//     stack.adopt(resource2, r => r.close())  // register with custom cleanup
//     stack.defer(() => cleanup())  // register a zero-arg callback
//     // When stack is disposed, all three run in reverse registration order
//
//   DisposableStack itself is Disposable, so it works with `using`.
//   AsyncDisposableStack is the async equivalent.
//
// ADAPTING LEGACY APIs (the adapter pattern):
//   Many existing APIs don't implement Disposable. Adapt them with defer:
//
//     using stack = new DisposableStack()
//     const conn = legacyOpen()           // doesn't implement [Symbol.dispose]
//     stack.defer(() => legacyClose(conn)) // adapt it
//
// WHEN NOT TO USE `using`:
//   - Class properties that live for the lifetime of their owner (use a destructor
//     or lifecycle hook instead)
//   - Objects you don't own (don't dispose something passed in as a parameter
//     unless explicitly documented)
//   - Long-lived resources that should survive function scope
//
// `close()` vs `[Symbol.dispose]()` naming:
//   Many existing APIs have `.close()`, `.destroy()`, `.disconnect()`.
//   Best practice: implement BOTH the named method AND [Symbol.dispose]:
//     [Symbol.dispose]() { this.close() }
//   This way, both old callers (using .close()) and new callers (using `using`)
//   work correctly.
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — implement Disposable on a custom class ───────────────────
// TODO: Implement [Symbol.dispose] on EventEmitter.
// It should call removeAllListeners() and push "emitter-closed" to log.

const log: string[] = []

class EventEmitter {
  private listeners: Map<string, Array<() => void>> = new Map()

  on(event: string, fn: () => void): void {
    const fns = this.listeners.get(event) ?? []
    fns.push(fn)
    this.listeners.set(event, fns)
  }

  emit(event: string): void {
    this.listeners.get(event)?.forEach(fn => fn())
  }

  removeAllListeners(): void {
    this.listeners.clear()
  }

  // TODO: implement [Symbol.dispose]()
}

// After your fix, EventEmitter should satisfy Disposable:
type _A1 = Expect<Extends<EventEmitter, Disposable>>

// ── Exercise B — DisposableStack for composition ─────────────────────────
// TODO: Refactor this function to use DisposableStack.
// Replace the manual cleanup array with stack.defer() calls.

function setupPipeline_old(): () => void {
  const cleanups: Array<() => void> = []

  const emitter = new EventEmitter()
  cleanups.push(() => emitter.removeAllListeners())

  const timer = setInterval(() => {}, 1000)
  cleanups.push(() => clearInterval(timer))

  return () => {
    // dispose in reverse order
    for (let i = cleanups.length - 1; i >= 0; i--) cleanups[i]()
  }
}

// TODO: Implement setupPipeline using DisposableStack.
// Return the stack as a Disposable so the caller can `using stack = setupPipeline()`.
function setupPipeline(): Disposable {
  const stack = new DisposableStack()
  // TODO: stack.defer() for emitter cleanup
  // TODO: stack.defer() for timer cleanup
  return stack
}

type _B1 = Expect<Extends<ReturnType<typeof setupPipeline>, Disposable>>

// ── Exercise C — stack.adopt for legacy APIs ─────────────────────────────
// `adopt` takes a resource and a disposer function.
// Use it when the resource doesn't implement Disposable.

interface LegacyHandle {
  id: string
  isOpen: boolean
}

function legacyOpen(id: string): LegacyHandle {
  return { id, isOpen: true }
}
function legacyClose(handle: LegacyHandle): void {
  handle.isOpen = false
  log.push(`legacy-closed: ${handle.id}`)
}

// TODO: Implement wrapLegacy() using DisposableStack.adopt.
// Return a Disposable wrapping the legacy handle.

function wrapLegacy(id: string): LegacyHandle & Disposable {
  const stack = new DisposableStack()
  const handle = legacyOpen(id)
  // TODO: stack.adopt(handle, legacyClose)
  return Object.assign(handle, { [Symbol.dispose]: () => stack[Symbol.dispose]() })
}

// After your fix, using wrapLegacy closes the legacy handle:
function useLegacy(id: string): void {
  using handle = wrapLegacy(id)
  log.push(`using: ${handle.id}`)
}  // legacyClose called here

type _C1 = Expect<Equal<typeof log, string[]>>

// ── Exercise D — both named method and Symbol.dispose ────────────────────
// TODO: Implement a Connection class with both close() and [Symbol.dispose].
// [Symbol.dispose] should delegate to close().

class Connection {
  connected = true

  close(): void {
    this.connected = false
    log.push("connection-closed")
  }

  // TODO: implement [Symbol.dispose]() that calls this.close()
}

// After your fix, both APIs work:
const conn1 = new Connection()
conn1.close()                   // explicit call
const conn2 = new Connection()
// using conn2 = new Connection()  // also valid

type _D1 = Expect<Extends<Connection, Disposable>>
