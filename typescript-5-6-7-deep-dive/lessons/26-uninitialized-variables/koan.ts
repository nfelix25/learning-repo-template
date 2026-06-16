import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 26 — Checked Uninitialized Variables                    [TS 5.7]
// ─────────────────────────────────────────────────────────────────────────
// WHAT IT CATCHES:
//   TypeScript 5.7 added a check for variables that are DECLARED but NEVER
//   ASSIGNED before they are READ. This is distinct from strictNullChecks
//   (which catches nullable values) — this catches a completely different bug:
//
//     let result: string        // declared, not initialized
//     if (condition) {
//       result = computeResult()
//     }
//     console.log(result)       // TS 5.7 error: used before assignment
//     //           ^^^^^^ Variable 'result' is used before being assigned.
//
//   Before TS 5.7:
//     TypeScript had partial checking for this, but in many control-flow
//     branches it would not report the error.
//
//   After TS 5.7:
//     The check is more thorough. Variables that are read before being
//     assigned in ANY reaching code path produce an error.
//
// DIFFERENCE FROM strictNullChecks:
//   strictNullChecks catches:  let x: string | null = null; x.length  // null deref
//   TS 5.7 catches:            let x: string;               x.length  // never assigned
//
// THE FIX — three approaches:
//   1. Initialize with a default:   let result = ""
//   2. Use a definite assignment:   let result!: string  (unsafe, use sparingly)
//   3. Restructure control flow so assignment is guaranteed before use
//
// WHEN IT HELPS:
//   - Variables declared at top of function and conditionally assigned
//   - Accumulator variables that might not be set if the loop doesn't run
//   - Error handling patterns where error is only assigned in catch blocks
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — conditionally assigned variable ──────────────────────────
// TODO: Fix this function. The variable `result` may not be assigned
// before it's returned.

function findFirst(items: number[], predicate: (n: number) => boolean): number | undefined {
  let result: number   // declared but potentially never assigned

  for (const item of items) {
    if (predicate(item)) {
      result = item
      break
    }
  }

  return result  // TS 5.7: error if result might never be assigned
  // Fix options:
  // 1. Initialize: let result: number | undefined = undefined
  // 2. Or just return directly from the loop
}

type _A1 = Expect<Equal<ReturnType<typeof findFirst>, number | undefined>>

// ── Exercise B — error accumulator pattern ───────────────────────────────
// TODO: Fix this pattern where error is only set in the catch block.

async function fetchData(url: string): Promise<{ data: unknown; error: Error | null }> {
  let error: Error    // declared, only assigned in catch

  try {
    const response = await fetch(url)
    const data = await response.json()
    return { data, error: null }
  } catch (e) {
    error = e as Error
  }

  return { data: null, error }  // TS 5.7: error might not be assigned
  // Fix: let error: Error | null = null (initialize with null)
}

type _B1 = Expect<Equal<ReturnType<typeof fetchData>, Promise<{ data: unknown; error: Error | null }>>>

// ── Exercise C — correct pattern: initialize with sentinel ───────────────
// The idiomatic fix: initialize with a type-safe default.

function processItems(items: string[]): string {
  let result = ""  // ✓ initialized — no TS 5.7 error possible

  for (const item of items) {
    result += item + ","
  }

  return result.slice(0, -1)  // remove trailing comma
}

type _C1 = Expect<Equal<ReturnType<typeof processItems>, string>>

// ── Exercise D — definite assignment assertion (use sparingly) ────────────
// `!` after the type tells TypeScript "trust me, this will be assigned."
// Use only when you KNOW it will be assigned but TS can't verify the pattern.

class Component {
  // Assigned in init() which MUST be called before use.
  // Using ! here is intentional — the caller contract ensures it.
  element!: HTMLElement

  init(el: HTMLElement): void {
    this.element = el
  }

  render(): void {
    this.element.innerHTML = "<div>rendered</div>"
  }
}

type _D1 = Expect<Equal<Component["element"], HTMLElement>>

// ── Exercise E — where NOT to use definite assignment ────────────────────
// `!` silences TS — don't use it to paper over a real initialization bug.

class BadPattern {
  // This is WRONG: using ! because you forgot to initialize,
  // not because you have a contract guaranteeing it.
  value!: string   // undefined at runtime if getValue() is never called

  getValue(): void {
    this.value = "hello"  // only called sometimes
  }

  use(): string {
    return this.value.toUpperCase()  // runtime crash if getValue never called
  }
}

// The fix: either initialize in the constructor or use optional type:
class GoodPattern {
  value: string = ""  // initialized

  getValue(): void {
    this.value = "hello"
  }

  use(): string {
    return this.value.toUpperCase()
  }
}

type _E1 = Expect<Equal<GoodPattern["value"], string>>
