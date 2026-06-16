import type { Not } from './05-negation'

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 05 — CURRY-HOWARD CORRESPONDENCE
// Koan 7 of 7: What constructive logic cannot prove
// ═══════════════════════════════════════════════════════════════════════════
//
// READING KOAN — study the failures, not the successes.
//
// TypeScript's type system embodies INTUITIONISTIC (constructive) logic.
// Intuitionistic logic is STRICTLY WEAKER than classical logic —
// there are theorems of classical logic that cannot be proved constructively.
//
// The missing principle: you cannot assert something true without
// EXHIBITING a proof of it.
//
// ───────────────────────────────────────────────────────────────────────────
// THE THREE UNPROVABLE CLASSICAL PRINCIPLES
// ───────────────────────────────────────────────────────────────────────────
//
// 1. EXCLUDED MIDDLE:  ∀A. A ∨ ¬A
//    "Every proposition is either true or false."
//    Cannot be proved constructively: we'd need to decide A for any arbitrary type,
//    which is undecidable in general.
//
// 2. DOUBLE NEGATION ELIMINATION:  ∀A. ¬¬A → A
//    "If A is not-not-true, then A is true."
//    Cannot be proved constructively: ¬¬A = ((A → ⊥) → ⊥).
//    We have no way to extract A from a function that "never produces a contradiction."
//
// 3. PEIRCE'S LAW:  ∀A B. ((A → B) → A) → A
//    Equivalent to excluded middle in classical logic.
//    No constructive proof exists.
//
// ───────────────────────────────────────────────────────────────────────────
// DEMONSTRATING THE FAILURES
// ───────────────────────────────────────────────────────────────────────────

// Attempt 1: Excluded middle.
// Uncomment this and try to implement it — you cannot.
//
// function excludedMiddle<A>(): A | Not<A> {
//   return ???  // What would you return? You'd need to know if A is inhabited.
// }

// Attempt 2: Double negation elimination.
// Uncomment this and try to implement it — you cannot.
//
// function dne<A>(notNotA: Not<Not<A>>): A {
//   // notNotA: (notA: (a: A) => never) => never
//   // We need an A. The only way to get one would be to... already have one.
//   return ???
// }

// Attempt 3: Peirce's law.
// Uncomment this and try to implement it.
//
// function peirce<A, B>(f: (k: (a: A) => B) => A): A {
//   return ???  // We'd need an A, but f only gives us A if we give it a (A → B)...
//               // which we'd need an A to call meaningfully.
// }

// ───────────────────────────────────────────────────────────────────────────
// WHAT CAN BE PROVED (constructively valid forms)
// ───────────────────────────────────────────────────────────────────────────

// These ARE constructively valid:

// ¬¬¬A → ¬A  (triple negation reduces)
export function tripleNeg<A>(nnnA: Not<Not<Not<A>>>): Not<A> {
  // nnnA: ((A → ⊥) → ⊥) → ⊥
  // Result: A → ⊥
  return (a) => nnnA((notA) => notA(a))
}

// (A → B) → ¬B → ¬A  (contraposition — the constructive direction)
export function contrapose<A, B>(f: (a: A) => B): (notB: Not<B>) => Not<A> {
  return (notB) => (a) => notB(f(a))
}

// ¬(A ∧ ¬A)  (no contradiction — A cannot be both true and false)
export function noContradiction<A>(): Not<[A, Not<A>]> {
  return ([a, notA]) => notA(a)
}

// ───────────────────────────────────────────────────────────────────────────
// WHY CONSTRUCTIVE LOGIC IS USEFUL FOR PROGRAMMING
// ───────────────────────────────────────────────────────────────────────────
//
// Constructive logic aligns with COMPUTATION:
//
//   Classical: "A or ¬A is true" — but gives you no algorithm to find which.
//   Constructive: you must exhibit A or exhibit ¬A — which gives you CODE.
//
// Every constructive proof is a program.
// Every classical proof that uses excluded middle would require:
//   - inspecting an arbitrary type at runtime
//   - deciding a potentially undecidable property
//
// TypeScript (and most programming type systems) are constructive because
// they track WHAT YOU CAN COMPUTE, not just WHAT IS LOGICALLY POSSIBLE.
//
// The restriction is a feature: if TypeScript accepted your code,
// it's because your program can actually produce values of those types.
//
// ───────────────────────────────────────────────────────────────────────────
// WHERE CLASSICAL LOGIC SNEAKS IN
// ───────────────────────────────────────────────────────────────────────────
//
// TypeScript has several escape hatches that introduce classical reasoning:
//
//   `any`        — bypasses all type checking (anything is provable)
//   `as`         — forced type assertion (trust me, it's this type)
//   `!`          — non-null assertion (trust me, it's not null)
//   `declare`    — axiom (assumed true without proof)
//
// Each of these is a way of saying "I assert this without constructive proof."
// Use them sparingly — each one is a place where the type checker can no longer
// guarantee correctness.

// ───────────────────────────────────────────────────────────────────────────
// FINAL REFLECTION
// ───────────────────────────────────────────────────────────────────────────
//
// You've now seen:
//
//   Module 01: Types are sets of values. never = ∅, unknown = 𝕌.
//   Module 02: Types obey algebraic laws. Variance, complement, and the `any` anomaly.
//   Module 03: Conditional types are set-builder notation. infer is pattern matching.
//   Module 04: Generics are type-level lambda calculus. Church encoding is possible.
//   Module 05: Types are propositions. Programs are proofs. TypeScript is a proof checker.
//
// These five lenses — set theory, algebra, conditionals, lambda calculus, logic —
// all describe the SAME thing: TypeScript's type system.
//
// The restrictions and surprising behaviors you encounter aren't arbitrary rules.
// They're consequences of a coherent mathematical system.
// Now you know the system.
