// ═══════════════════════════════════════════════════════════════════════════
// MODULE 05 — CURRY-HOWARD CORRESPONDENCE
// Koan 3 of 7: Conjunction as product type
// ═══════════════════════════════════════════════════════════════════════════
//
// In logic, A ∧ B ("A and B") is true when BOTH A and B are true.
//
// Under Curry-Howard:
//   PROOF OF A ∧ B  =  a pair (value of type [A, B])
//
// To prove A ∧ B, you must provide:
//   - a proof of A (the first component)
//   - a proof of B (the second component)
//
// Elimination rules (how to USE a proof of A ∧ B):
//   - fst: [A, B] → A     (project the first component)
//   - snd: [A, B] → B     (project the second component)
//
// ───────────────────────────────────────────────────────────────────────────
// PRODUCT TYPES IN TYPESCRIPT
// ───────────────────────────────────────────────────────────────────────────
//
// TypeScript has two product type constructions:
//
//   Tuples:   [A, B]             — anonymous products
//   Objects:  { a: A, b: B }     — labeled products
//
// Both are valid encodings of A ∧ B.
// Objects are more common in practice; tuples are cleaner for theory.
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS — implement each rule
// ───────────────────────────────────────────────────────────────────────────

// Introduction rule: pair — construct a proof of A ∧ B.
// "To prove A ∧ B, provide a proof of A and a proof of B."
export function pair<A, B>(a: A, b: B): [A, B] {
  // YOUR CODE HERE
  return [a, b]
}

// Elimination rule (left): fst — extract the proof of A.
// "From a proof of A ∧ B, get a proof of A."
export function fst<A, B>(p: [A, B]): A {
  // YOUR CODE HERE
  return p[0]
}

// Elimination rule (right): snd — extract the proof of B.
// "From a proof of A ∧ B, get a proof of B."
export function snd<A, B>(p: [A, B]): B {
  // YOUR CODE HERE
  return p[1]
}

// ───────────────────────────────────────────────────────────────────────────
// DERIVED THEOREMS — prove these using only pair, fst, snd
// ───────────────────────────────────────────────────────────────────────────

// A ∧ B → B ∧ A  (conjunction is commutative)
export function andComm<A, B>(p: [A, B]): [B, A] {
  // YOUR CODE HERE — use fst and snd
  return [snd(p), fst(p)]
}

// A ∧ B → A  (left projection, identical to fst)
export function proj1<A, B>(p: [A, B]): A {
  return fst(p)
}

// (A ∧ B) ∧ C → A ∧ (B ∧ C)  (conjunction is associative)
export function andAssoc<A, B, C>(p: [[A, B], C]): [A, [B, C]] {
  // YOUR CODE HERE
  return [fst(fst(p)), [snd(fst(p)), snd(p)]]
}

// A → B → A ∧ B  (curry the pair constructor)
export function both<A, B>(a: A): (b: B) => [A, B] {
  // YOUR CODE HERE
  return (b) => pair(a, b)
}

// ───────────────────────────────────────────────────────────────────────────
// THE CONNECTION TO INTERSECTION TYPES
// ───────────────────────────────────────────────────────────────────────────
//
// We used tuples [A, B] as our product, but TypeScript's A & B also models
// conjunction for object types:
//
//   type HasName = { name: string }
//   type HasAge  = { age: number }
//   type Person  = HasName & HasAge   ← A ∧ B as intersection
//
// A value of type Person proves BOTH HasName and HasAge simultaneously.
// You can project via property access: person.name (fst), person.age (snd).
//
// Tuples are "anonymous products"; intersections are "structural products".
// Both satisfy the same logical rules.
