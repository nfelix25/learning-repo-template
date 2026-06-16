// ═══════════════════════════════════════════════════════════════════════════
// MODULE 05 — CURRY-HOWARD CORRESPONDENCE
// Koan 4 of 7: Disjunction as union type
// ═══════════════════════════════════════════════════════════════════════════
//
// In logic, A ∨ B ("A or B") is true when AT LEAST ONE of A or B is true.
//
// Under Curry-Howard:
//   PROOF OF A ∨ B  =  a value of type A | B
//
// To prove A ∨ B, you must provide EITHER:
//   - a proof of A (a value of type A), OR
//   - a proof of B (a value of type B)
//
// This is CONSTRUCTIVE — you can't just say "one of them must be true."
// You have to commit to which one you're proving.
//
// Introduction rules:
//   inl: A → A | B     ("inject left" — give a proof of A)
//   inr: B → A | B     ("inject right" — give a proof of B)
//
// Elimination rule (case analysis):
//   match: (A | B) → (A → C) → (B → C) → C
//   "To use a proof of A ∨ B, handle both cases."
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS — implement each rule
// ───────────────────────────────────────────────────────────────────────────

// Introduction (left): inl — inject a proof of A into A | B.
export function inl<A, B>(a: A): A | B {
  // YOUR CODE HERE
  return a
}

// Introduction (right): inr — inject a proof of B into A | B.
export function inr<A, B>(b: B): A | B {
  // YOUR CODE HERE
  return b
}

// Elimination: match — case analysis on a disjunction.
// "If we have A | B, and we can handle A to get C, and handle B to get C,
//  then we can produce C."
export function match<A, B, C>(
  value: A | B,
  onA: (a: A) => C,
  onB: (b: B) => C
): C {
  // YOUR CODE HERE
  // Hint: TypeScript needs a way to distinguish A from B.
  // This is the fundamental challenge of union elimination — you need a discriminant.
  // For this generic version, we can't distinguish A from B at runtime without help.
  // See the note below.
  //
  // For now, implement the simpler discriminated union version:
  return value as unknown as C  // placeholder — replace with the note's approach
}

// ───────────────────────────────────────────────────────────────────────────
// NOTE: The discriminant requirement
// ───────────────────────────────────────────────────────────────────────────
//
// The generic `match` above has a problem: at runtime, TypeScript has erased
// types. We can't distinguish `A` from `B` without a runtime marker.
//
// The practical solution is DISCRIMINATED UNIONS — add a tag:
type Result<A, B> =
  | { tag: 'ok';  value: A }
  | { tag: 'err'; value: B }

export function matchResult<A, B, C>(
  result: Result<A, B>,
  onOk:  (a: A) => C,
  onErr: (b: B) => C
): C {
  // YOUR CODE HERE — use result.tag to discriminate
  switch (result.tag) {
    case 'ok':  return onOk(result.value)
    case 'err': return onErr(result.value)
  }
}

// ───────────────────────────────────────────────────────────────────────────
// EXHAUSTIVENESS: THE TYPE SYSTEM ENFORCES PROOF OBLIGATIONS
// ───────────────────────────────────────────────────────────────────────────
//
// In logic, to eliminate A ∨ B you must handle BOTH cases.
// TypeScript enforces this — switch statements on discriminated unions
// must cover every branch to satisfy strict mode.
//
// The `never` trick for exhaustiveness checking:

function assertNever(x: never): never {
  throw new Error(`Unhandled case: ${String(x)}`)
}

type Shape = { kind: 'circle'; r: number } | { kind: 'rect'; w: number; h: number }

export function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.r ** 2
    case 'rect':   return shape.w * shape.h
    // If you add a new Shape variant and forget to add a case here,
    // TypeScript will error on the line below — shape would not be `never`.
    default: return assertNever(shape)
  }
}

// ───────────────────────────────────────────────────────────────────────────
// DERIVED THEOREM: A ∨ B → B ∨ A  (disjunction is commutative)
// ───────────────────────────────────────────────────────────────────────────
export function orComm<A, B>(x: A | B, isA: (x: A | B) => x is A): B | A {
  if (isA(x)) {
    return inr<B, A>(x)   // x : A, inject into B | A at right position
  } else {
    const b = x as B
    return inl<B, A>(b)   // x : B, inject into B | A at left position
  }
}
