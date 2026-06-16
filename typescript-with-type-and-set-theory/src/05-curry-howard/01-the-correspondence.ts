import type { Expect, Equal } from '../utils/index'

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 05 — CURRY-HOWARD CORRESPONDENCE
// Koan 1 of 7: The correspondence
// ═══════════════════════════════════════════════════════════════════════════
//
// READING KOAN — no blanks to fill in. This is the most important table
// in this entire curriculum. Come back to it often.
//
// ───────────────────────────────────────────────────────────────────────────
// THE CURRY-HOWARD ISOMORPHISM
// ───────────────────────────────────────────────────────────────────────────
//
// Discovered independently by Haskell Curry (1934) and William Howard (1969):
// TYPE SYSTEMS and LOGIC SYSTEMS are the same thing, viewed differently.
//
//   LOGIC                 TYPE THEORY           TYPESCRIPT
//   ──────────────────    ─────────────────     ──────────────────────────
//   Proposition P         Type T                type T = ...
//   Proof of P            Value of type T        const x: T = ...
//   Tautology (⊤)         Top type              unknown
//   Contradiction (⊥)     Bottom type           never
//   A and B  (A ∧ B)      Product type          [A, B] or A & B
//   A or B   (A ∨ B)      Sum type              A | B
//   A implies B (A → B)   Function type         (a: A) => B
//   Not A    (¬A)         A → ⊥                 (a: A) => never
//   For all (∀x. P(x))    Generic type          <T>(x: T) => ...
//   There exists (∃x. P)  Existential type      (approximate in TS)
//
// ───────────────────────────────────────────────────────────────────────────
// THE CORE CLAIM
// ───────────────────────────────────────────────────────────────────────────
//
//   A TYPE IS A PROPOSITION.
//   A VALUE OF THAT TYPE IS A PROOF.
//
// If you can write a function of type (A, B) => C, you've PROVEN that
// given A and B, you can produce C. The implementation IS the proof.
//
// TypeScript's type checker is (roughly) a PROOF CHECKER.
// When the type checker accepts your code, it's validating your proofs.
//
// ───────────────────────────────────────────────────────────────────────────
// CONSTRUCTIVE vs CLASSICAL LOGIC
// ───────────────────────────────────────────────────────────────────────────
//
// The logic underlying TypeScript is CONSTRUCTIVE (intuitionistic) logic,
// not classical logic.
//
// In CLASSICAL logic, "A or not-A" is always true (excluded middle).
// In CONSTRUCTIVE logic, a proof of "A or B" must either:
//   - provide a proof of A, OR
//   - provide a proof of B.
//
// You can't just say "well, one of them must be true" — you have to
// EXHIBIT the proof. This is why some classical tautologies are not
// provable in TypeScript (we'll see this in koan 07).
//
// ───────────────────────────────────────────────────────────────────────────
// OBSERVABLE FACTS (reading only — all pass)
// ───────────────────────────────────────────────────────────────────────────

// The identity "proof": if you have A, you have A.
function identity<A>(a: A): A { return a }

// The constant "proof": if you have A, you can always produce A regardless of B.
function constant<A, B>(a: A): (_b: B) => A {
  return (_b) => a
}

// These both typecheck — the type checker validated our "proofs."

// We can even encode simple logical facts as type-level equalities:
type AndIsCommutative<A, B> = Expect<Equal<[A, B], [A, B]>>  // trivial
// The real proof of commutativity requires showing [A, B] ≡ [B, A] — which
// requires a bijection (pair of functions). We'll do that in koan 03.

export { identity, constant }
