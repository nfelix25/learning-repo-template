// ═══════════════════════════════════════════════════════════════════════════
// MODULE 05 — CURRY-HOWARD CORRESPONDENCE
// Koan 5 of 7: Negation and ex falso
// ═══════════════════════════════════════════════════════════════════════════
//
// In constructive logic, negation is defined as:
//
//   ¬A  =  A → ⊥
//
// "A is false" means: "from a proof of A, you can derive a contradiction (⊥)."
// There is no other way to define negation constructively.
//
// Under Curry-Howard:
//   ¬A  =  (a: A) => never
//
// A function of type (a: A) => never is a proof of ¬A.
// Since `never` is uninhabited (no value of type `never` exists),
// such a function can never actually be called with a real argument.
//
// ───────────────────────────────────────────────────────────────────────────
// EX FALSO QUODLIBET (from falsehood, anything follows)
// ───────────────────────────────────────────────────────────────────────────
//
// In logic: ⊥ → A   (from a contradiction, you can prove anything)
// In TypeScript: (x: never) => T
//
// This function is vacuously correct — its premise is false (no value of
// type `never` exists), so the promise is trivially fulfilled.
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS
// ───────────────────────────────────────────────────────────────────────────

// The type of negation:
export type Not<A> = (a: A) => never

// Ex falso: from never (⊥), produce anything.
export function absurd<T>(x: never): T {
  return x  // TypeScript accepts this — `never` is assignable to anything
}

// A proof of ¬¬A that does NOT give us back A.
// In constructive logic, ¬¬A is WEAKER than A.
// We can prove ¬¬A from A (double negation introduction),
// but we CANNOT prove A from ¬¬A (double negation elimination).

// Double negation introduction: A → ¬¬A
// "If we have a proof of A, then any function assuming ¬A is contradictory."
export function dni<A>(a: A): Not<Not<A>> {
  // YOUR CODE HERE
  // Hint: Not<Not<A>> = (notA: Not<A>) => never = (notA: (a: A) => never) => never
  return (notA) => notA(a)
}

// Double negation elimination: ¬¬A → A  (CANNOT be implemented!)
// This is a classical tautology that is NOT provable constructively.
// Uncomment below to see the type error:
//
// export function dne<A>(notNotA: Not<Not<A>>): A {
//   return ???  // there is no way to produce an A here
// }
//
// We have notNotA: (notA: (a: A) => never) => never
// To get an A, we'd need to apply notNotA, which requires providing a (notA: Not<A>).
// But creating a Not<A> requires already having a proof that A leads to contradiction...
// which requires knowing A is false. Circular.

// ───────────────────────────────────────────────────────────────────────────
// WHAT WE CAN PROVE
// ───────────────────────────────────────────────────────────────────────────

// ¬A ∧ A → ⊥  (contradiction: not-A AND A leads to bottom)
export function contradiction<A>(notA: Not<A>, a: A): never {
  // YOUR CODE HERE
  return notA(a)
}

// A → ¬¬A  (already done above as dni)

// ¬(A ∨ B) → ¬A ∧ ¬B  (De Morgan's law, constructive direction)
export function deMorganLeft<A, B>(
  notAorB: Not<A | B>
): [Not<A>, Not<B>] {
  // YOUR CODE HERE
  // Hint: to produce Not<A>, assume a and call notAorB with it (inl-style).
  return [
    (a) => notAorB(a),
    (b) => notAorB(b),
  ]
}

// ¬A ∨ ¬B → ¬(A ∧ B)  (De Morgan, other direction — also constructively valid)
export function deMorganRight<A, B>(
  notAorNotB: Not<A> | Not<B>
): Not<[A, B]> {
  // YOUR CODE HERE
  return (pair) => {
    if (typeof notAorNotB === 'function') {
      // notAorNotB is Not<A> or Not<B> — but we can't distinguish at runtime generically.
      // In practice: we'd need a tagged union. Accept either for the type to work:
      return (notAorNotB as Not<A>)(pair[0])
    }
    return absurd(notAorNotB as never)
  }
}

// ───────────────────────────────────────────────────────────────────────────
// WHAT WE CANNOT PROVE (classical vs constructive)
// ───────────────────────────────────────────────────────────────────────────
//
// The following are VALID in classical logic but NOT constructively:
//
//   double negation elimination:  ¬¬A → A
//   excluded middle:              A ∨ ¬A
//   Peirce's law:                 ((A → B) → A) → A
//
// TypeScript's type system is a constructive logic.
// We'll see this explicitly in koans 06 and 07.
