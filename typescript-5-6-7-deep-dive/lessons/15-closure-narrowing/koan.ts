import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 15 — Preserved Narrowing in Closures                    [TS 5.4]
// ─────────────────────────────────────────────────────────────────────────
// PROBLEM — closures used to destroy narrowing:
//   Before TS 5.4, TypeScript was conservative about closures. If a variable
//   had been narrowed AND could potentially be reassigned, TypeScript assumed
//   any closure might observe it in an un-narrowed state:
//
//     let x: string | null = getValue()
//     if (x !== null) {
//       // x is narrowed to string here
//       setTimeout(() => {
//         console.log(x.toUpperCase())
//         //            ^  Error! x could be null inside the closure
//       }, 100)
//     }
//
//   This was technically correct — x COULD be reassigned to null before
//   the timeout fires. But in many cases, x is never reassigned, and the
//   error was a false positive that forced workarounds like const copies:
//     const xCopy = x  // capture the narrowed value
//
// SOLUTION (TS 5.4):
//   TypeScript now checks if a narrowed variable is reassigned AFTER the
//   point where the closure is created. If not reassigned, the narrowing
//   is preserved inside the closure.
//
//   The rule: "If the variable is not assigned anywhere between the
//   narrowing point and the closure creation, the closure sees the
//   narrowed type."
//
// WHEN IT STILL DOESN'T NARROW:
//   - If the variable IS reassigned after the closure captures it
//   - If the closure is created before the narrowing
//   - If the variable could be modified by another reference
//
// BEFORE vs AFTER TS 5.4:
//   Before:
//     const copy = x  // workaround required
//     setTimeout(() => console.log(copy.toUpperCase()), 100)
//   After (TS 5.4+):
//     if (x !== null) {
//       setTimeout(() => console.log(x.toUpperCase()), 100)  // works!
//     }
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — closure sees narrowed type (post-5.4) ───────────────────
// In TS 5.4+, this should compile without the const-copy workaround.

declare function fetchUser(): string | null

let user = fetchUser()

if (user !== null) {
  // TODO: In TS 5.4+, this callback should compile without error.
  // Before 5.4, you needed: const u = user; setTimeout(() => u.toUpperCase(), ...)
  const callback = () => {
    // TODO: use `user` directly (not a copy) — it should be narrowed to string
    return user  // should be string here, not string | null
  }
  type _A1 = Expect<Equal<ReturnType<typeof callback>, string | null>>
  // After your fix (understanding that TS 5.4 preserved narrowing here):
  // change the type assertion to:
  // type _A1 = Expect<Equal<ReturnType<typeof callback>, string>>
}

// ── Exercise B — reassignment breaks the narrowing ────────────────────────
// If the variable is reassigned after the closure is created, TS can't narrow.

let message: string | null = "hello"

if (message !== null) {
  const printLater = () => {
    // message might be null by the time this runs — it COULD be reassigned
    return message  // string | null — TypeScript is correct to be uncertain
  }
  // Simulate a reassignment that WOULD make the closure unsafe:
  message = null  // ← this reassignment after the closure means TS keeps string | null
  type _B1 = Expect<Equal<ReturnType<typeof printLater>, string | null>>
}

// ── Exercise C — last-assignment narrowing ───────────────────────────────
// TS tracks the "last assignment" before a closure.
// If the last assignment before the closure is a narrowing, it's preserved.

function processResult(data: string | number | null): () => string {
  let result: string | number | null = data

  if (typeof result === "string") {
    // `result` is narrowed to string here and NOT reassigned anywhere below.
    // TS 5.4+: the closure preserves the narrowing.
    return () => result.toUpperCase()  // ← works in TS 5.4+
  }

  if (typeof result === "number") {
    return () => String(result)  // ← works in TS 5.4+
  }

  // result is null — return a constant (no reassignment of `result` needed)
  return () => "default"
}

type _C1 = Expect<Equal<ReturnType<typeof processResult>, () => string>>

// ── Exercise D — identify which pattern still needs a copy ───────────────
// Some patterns still require capturing a const copy. Which one?

// Pattern 1 — val narrowed, NOT reassigned → closure preserves narrowing (TS 5.4+)
function maybeAsync1(val: string | null): (() => string) | undefined {
  if (val !== null) {
    const cb = () => val.toUpperCase()  // val is string ✓ (no reassignment after)
    return cb
  }
}

type _D1 = Expect<Equal<ReturnType<typeof maybeAsync1>, (() => string) | undefined>>

// Pattern 2 — val reassigned AFTER closure creation → narrowing lost (still needs copy)
function maybeAsync2(val: string | null): (() => string) | undefined {
  if (val !== null) {
    const captured = val       // ← must capture BEFORE reassignment
    val = null                 // reassignment invalidates narrowing for closures
    const cb = () => captured.toUpperCase()  // use captured, not val
    return cb
  }
}
