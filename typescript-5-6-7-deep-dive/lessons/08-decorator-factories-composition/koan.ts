import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 08 — Decorator Factories and Composition                [TS 5.0]
// ─────────────────────────────────────────────────────────────────────────
// DECORATOR FACTORIES:
//   A factory is a function that returns a decorator.
//   This lets you parameterize decorators:
//
//     @retry(3)          // factory called with 3, returns the decorator
//     method() { ... }
//
//   Equivalent to:
//     const retryDecorator = retry(3)
//     retryDecorator(method, context)
//
//   Factory type pattern:
//     function retry(times: number) {
//       return function<This, Args extends unknown[], Return>(
//         fn: (this: This, ...args: Args) => Return,
//         ctx: ClassMethodDecoratorContext<...>
//       ): (this: This, ...args: Args) => Return { ... }
//     }
//
// COMPOSITION ORDER — critical to understand:
//   When multiple decorators are stacked:
//
//     @A
//     @B
//     @C
//     method() { ... }
//
//   EVALUATION order (factories are called): A, B, C  (top to bottom)
//   APPLICATION order (decorators run):       C, B, A  (bottom to top)
//
//   Think of it like function composition: A(B(C(method)))
//   The innermost decorator (C) wraps the original method first.
//   The outermost decorator (A) wraps the already-wrapped result.
//
// WHY IT MATTERS:
//   If @retry wraps @timeout, retrying will also re-apply the timeout.
//   If @timeout wraps @retry, ALL retries share ONE timeout.
//   Order changes semantics significantly.
//
// REAL-WORLD USES:
//   @retry(3)       — retry failed async operations
//   @timeout(500)   — abort after N milliseconds
//   @debounce(200)  — delay invocation
//   @throttle(100)  — rate-limit calls
//   @deprecated     — log warning on use
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — @retry(n) factory ───────────────────────────────────────
// Retries an async method up to `times` times if it throws.
// On final failure, re-throws the last error.
//
// TODO: Implement the retry factory.

function retry(times: number) {
  return function<This extends object, Args extends unknown[], Return>(
    fn: (this: This, ...args: Args) => Promise<Return>,
    _context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return>>
  ): (this: This, ...args: Args) => Promise<Return> {
    // TODO: return a wrapper that calls fn up to `times` times on failure
    return fn  // replace this line
  }
}

class DataService {
  attemptCount = 0

  @retry(3)
  async fetchData(id: number): Promise<string> {
    this.attemptCount++
    if (this.attemptCount < 3) throw new Error("Network error")
    return `data-${id}`
  }
}

// Type is preserved through the decorator:
type _A1 = Expect<Equal<
  ReturnType<DataService["fetchData"]>,
  Promise<string>
>>

// ── Exercise B — @timeout(ms) factory ────────────────────────────────────
// Rejects if the method takes longer than `ms` milliseconds.
//
// TODO: Implement the timeout factory using Promise.race.

function timeout(ms: number) {
  return function<This extends object, Args extends unknown[], Return>(
    fn: (this: This, ...args: Args) => Promise<Return>,
    _context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return>>
  ): (this: This, ...args: Args) => Promise<Return> {
    // TODO: return a wrapper that races fn against a setTimeout rejection
    return fn  // replace this line
  }
}

class SlowService {
  @retry(2)
  @timeout(1000)
  async load(): Promise<string> {
    return "loaded"
  }
}

// Order check: @retry wraps @timeout here.
// This means: each retry attempt gets its own fresh 1000ms timeout.
// Swap them and each timeout will cover ALL retry attempts combined.
type _B1 = Expect<Equal<ReturnType<SlowService["load"]>, Promise<string>>>

// ── Exercise C — composition order demonstration ─────────────────────────
// Read-only exercise. Trace the evaluation and application order.
//
// Given this stacking:
//   @A   ← evaluated 1st, applied 3rd (outermost wrapper)
//   @B   ← evaluated 2nd, applied 2nd
//   @C   ← evaluated 3rd, applied 1st (innermost wrapper)
//   method()
//
// The call stack when method() is invoked:
//   A_wrapper calls → B_wrapper calls → C_wrapper calls → original method

const callOrder: string[] = []

function makeLogger(name: string) {
  callOrder.push(`evaluated: ${name}`)
  return function<This extends object, Args extends unknown[], Return>(
    fn: (this: This, ...args: Args) => Return,
    _ctx: ClassMethodDecoratorContext
  ): (this: This, ...args: Args) => Return {
    return function(this: This, ...args: Args): Return {
      callOrder.push(`called: ${name}`)
      return fn.apply(this, args)
    }
  }
}

class Traced {
  @makeLogger("A")
  @makeLogger("B")
  @makeLogger("C")
  run(): void {}
}

// At class definition: evaluated = ["A", "B", "C"]   (top to bottom)
// At run() call:       called   = ["A", "B", "C"]    (top to bottom too!
//                                 because A wraps B wraps C wraps original)
type _C1 = Expect<Equal<typeof callOrder, string[]>>
