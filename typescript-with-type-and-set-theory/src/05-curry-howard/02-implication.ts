// ═══════════════════════════════════════════════════════════════════════════
// MODULE 05 — CURRY-HOWARD CORRESPONDENCE
// Koan 2 of 7: Implication as function type
// ═══════════════════════════════════════════════════════════════════════════
//
// In logic, A → B means "A implies B" — if A is true, then B is true.
//
// Under Curry-Howard:
//   PROOF OF A → B  =  a function of type (a: A) => B
//
// To prove A → B, provide a function that:
//   - takes a proof of A (a value of type A)
//   - produces a proof of B (a value of type B)
//
// The function body IS the proof. TypeScript checking it IS proof checking.
//
// ───────────────────────────────────────────────────────────────────────────
// CLASSICAL LOGIC TAUTOLOGIES AS FUNCTION TYPES
// ───────────────────────────────────────────────────────────────────────────
//
//   A → A                         Identity
//   A → (B → A)                   K combinator (constant function)
//   (A → B) → (B → C) → (A → C)  Transitivity (function composition)
//   (A → B → C) → B → A → C      Flip
//   (A → B → C) → (A → B) → A → C  S combinator
//
// Each of these corresponds to a provable tautology in propositional logic.
// "Provable" means we can IMPLEMENT a function with that type.
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS — implement each proof
// ───────────────────────────────────────────────────────────────────────────

// 1. A → A (identity)
//    "Given a proof of A, produce a proof of A."
export function id<A>(a: A): A {
  return /* your implementation */ a
}
//   This is already filled in — study its type signature.

// 2. A → (B → A)  (the K combinator / constant)
//    "Given a proof of A, produce a function that ignores B and returns A."
export function K<A, B>(a: A): (_b: B) => A {
  // YOUR CODE HERE — replace the body
  return (_b) => a
}

// 3. (A → B) → (B → C) → (A → C)  (transitivity / composition)
//    "If A implies B, and B implies C, then A implies C."
//    This is just function composition!
export function compose<A, B, C>(
  ab: (a: A) => B,
  bc: (b: B) => C
): (a: A) => C {
  // YOUR CODE HERE
  return (a) => bc(ab(a))
}

// 4. (A → B → C) → B → A → C  (flip)
//    "Swap the order of arguments."
export function flip<A, B, C>(
  f: (a: A) => (b: B) => C
): (b: B) => (a: A) => C {
  // YOUR CODE HERE
  return (b) => (a) => f(a)(b)
}

// 5. (A → B → C) → (A → B) → A → C  (the S combinator)
//    This is the S combinator from combinatory logic.
//    S = λf. λg. λx. f(x)(g(x))
export function S<A, B, C>(
  f: (a: A) => (b: B) => C,
  g: (a: A) => B
): (a: A) => C {
  // YOUR CODE HERE
  return (a) => f(a)(g(a))
}

// ───────────────────────────────────────────────────────────────────────────
// THE TAKEAWAY
// ───────────────────────────────────────────────────────────────────────────
//
// You've just proved five tautologies by writing functions.
// The type signatures are theorems. The bodies are proofs.
// TypeScript's type checker verified each proof.
//
// This is Curry-Howard in action.
