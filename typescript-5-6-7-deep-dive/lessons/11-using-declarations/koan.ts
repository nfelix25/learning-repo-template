import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 11 — `using` Declarations (Explicit Resource Management) [TS 5.2]
// ─────────────────────────────────────────────────────────────────────────
// PROBLEM — manual cleanup is error-prone:
//   Any time you open something you must close it: files, DB connections,
//   timers, event listeners, temp files, etc. The classic pattern:
//
//     const handle = openFile("data.txt")
//     try {
//       doWork(handle)
//     } finally {
//       handle.close()   // easily forgotten, missed on early return, etc.
//     }
//
//   Bugs happen when:
//   - The `finally` block is omitted
//   - An early `return` exits before cleanup
//   - The resource is opened inside a nested scope and cleanup is far away
//
// SOLUTION — `using`:
//   A new variable declaration keyword. When the block exits (normally,
//   via return, or via exception), the resource's `[Symbol.dispose]()` is
//   called automatically:
//
//     using handle = openFile("data.txt")
//     doWork(handle)
//     // [Symbol.dispose]() called here automatically — no finally needed
//
// THE Disposable INTERFACE:
//   Any object that implements [Symbol.dispose](): void is Disposable.
//   `using` requires the value to be Disposable (TypeScript enforces this).
//
//     interface Disposable {
//       [Symbol.dispose](): void
//     }
//
// SCOPING:
//   `using` is block-scoped like `const`. The resource is disposed at the
//   end of the block it's declared in:
//     {
//       using x = makeResource()
//       use(x)
//     }  ← x is disposed here
//
// MULTIPLE `using` — LIFO ORDER:
//   If multiple `using` declarations are in scope, they are disposed in
//   Last-In-First-Out order (like a stack):
//     using a = openA()   // disposed 2nd
//     using b = openB()   // disposed 1st
//
// ERROR HANDLING:
//   If the body throws AND dispose throws, TypeScript uses a `SuppressedError`
//   that wraps both. The body's error is available at err.error.
// ═══════════════════════════════════════════════════════════════════════════

// ── Shared setup: a mock Disposable resource ─────────────────────────────

const disposalLog: string[] = []

function makeResource(name: string): Disposable & { name: string } {
  return {
    name,
    [Symbol.dispose]() {
      disposalLog.push(`disposed: ${name}`)
    }
  }
}

// ── Exercise A — basic `using` declaration ───────────────────────────────
// TODO: Rewrite this function to use `using` instead of try/finally.
// The resource should be disposed when the function returns.

function processData_OLD(input: string): string {
  const resource = makeResource("data-processor")
  try {
    return `processed: ${input} (${resource.name})`
  } finally {
    resource[Symbol.dispose]()
  }
}

// TODO: Implement processData using `using`:
function processData(input: string): string {
  // Replace with: using resource = makeResource("data-processor")
  const resource = makeResource("data-processor")
  return `processed: ${input} (${resource.name})`
}

type _A1 = Expect<Equal<ReturnType<typeof processData>, string>>

// ── Exercise B — LIFO disposal order ─────────────────────────────────────
// TODO: Rewrite this function using two `using` declarations.
// Confirm the disposal order is LIFO (b disposed before a).

function openBoth(): void {
  // TODO: using a = makeResource("a"), using b = makeResource("b")
  // After block exit: disposalLog should be ["disposed: b", "disposed: a"]
  const a = makeResource("a")
  const b = makeResource("b")
  a[Symbol.dispose]()
  b[Symbol.dispose]()
}

openBoth()
type _B1 = Expect<Equal<typeof disposalLog, string[]>>

// ── Exercise C — `using` with a class implementing Disposable ────────────
// TODO: Add [Symbol.dispose] to this class so it can be used with `using`.

class FileHandle {
  constructor(readonly path: string) {}

  read(): string {
    return `content of ${this.path}`
  }

  // TODO: implement [Symbol.dispose]() — push "closed: <path>" to disposalLog
}

function readFile(path: string): string {
  // TODO: replace with `using handle = new FileHandle(path)`
  const handle = new FileHandle(path)
  return handle.read()
}

type _C1 = Expect<Equal<ReturnType<typeof readFile>, string>>

// ── Exercise D — `using` in a scope block ────────────────────────────────
// `using` works in any block, not just function bodies.
// The resource is disposed at the end of the nearest enclosing block.
//
// TODO: Implement the setup below so dispose is called at the right time.

let disposeCalledAt: string | null = null

function scopeDemo(): string {
  let result = "none"

  {
    // TODO: use `using conn = makeResource("connection")` inside this block
    const conn = makeResource("connection")
    result = conn.name
    // dispose should happen HERE, before the outer function continues
  }

  disposeCalledAt = result
  return result
}

type _D1 = Expect<Equal<ReturnType<typeof scopeDemo>, string>>
