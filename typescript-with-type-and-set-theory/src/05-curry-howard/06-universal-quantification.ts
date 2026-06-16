// ═══════════════════════════════════════════════════════════════════════════
// MODULE 05 — CURRY-HOWARD CORRESPONDENCE
// Koan 6 of 7: Universal quantification as generics
// ═══════════════════════════════════════════════════════════════════════════
//
// In predicate logic, UNIVERSAL QUANTIFICATION is:
//
//   ∀x. P(x)   "for all x, P(x) holds"
//
// Under Curry-Howard:
//   PROOF OF ∀T. P(T)  =  a generic function <T>(x: T) => ...
//
// A generic function that works for ALL types T is a proof of a universal
// statement. TypeScript checks that the implementation doesn't assume
// anything specific about T — the function must work for any type.
//
// ───────────────────────────────────────────────────────────────────────────
// EXAMPLES
// ───────────────────────────────────────────────────────────────────────────
//
//   function identity<T>(x: T): T { return x }
//   // Proves: ∀T. T → T
//
//   function constant<A, B>(a: A): (_: B) => A { return _ => a }
//   // Proves: ∀A. ∀B. A → B → A
//
//   function compose<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C {
//     return a => g(f(a))
//   }
//   // Proves: ∀A B C. (A → B) → (B → C) → (A → C)
//
// ───────────────────────────────────────────────────────────────────────────
// EXISTENTIAL TYPES (what TypeScript can't directly express)
// ───────────────────────────────────────────────────────────────────────────
//
// EXISTENTIAL QUANTIFICATION:
//   ∃T. P(T)   "there exists a T such that P(T) holds"
//
// A proof of ∃T. P(T) requires:
//   - a witness type T
//   - a proof that P(T) holds for this specific T
//
// TypeScript doesn't have first-class existential types, but they can be
// APPROXIMATED using closures (hiding the witness type):
//
//   // ∃T. { value: T, toString: (v: T) => string }
//   type ExistentialBox = <R>(consumer: <T>(box: { value: T; show: (v: T) => string }) => R) => R
//
// This "continuation-passing" encoding hides T from the outside.
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS
// ───────────────────────────────────────────────────────────────────────────

// 1. The polymorphic flip: ∀A B C. (A → B → C) → B → A → C
export function flip<A, B, C>(f: (a: A) => (b: B) => C): (b: B) => (a: A) => C {
  // YOUR CODE HERE
  return (b) => (a) => f(a)(b)
}

// 2. The ap combinator: ∀A B. (A → B) → A → B
//    (This is just function application, but as a proof it's interesting:
//    it proves that if we have a proof of A → B and a proof of A, we get B.)
export function ap<A, B>(f: (a: A) => B, a: A): B {
  // YOUR CODE HERE
  return f(a)
}

// 3. Implement map for a "Box" — prove that if A implies B, then Box<A> implies Box<B>.
//    (Functors in category theory are exactly this pattern.)
type Box<T> = { value: T }

export function mapBox<A, B>(box: Box<A>, f: (a: A) => B): Box<B> {
  // YOUR CODE HERE
  return { value: f(box.value) }
}

// 4. Existential type approximation via continuation passing.
//    The type below encodes ∃T. { value: T; show: (v: T) => string }
type ExBox = <R>(k: <T>(box: { value: T; show: (v: T) => string }) => R) => R

// pack: introduce an existential — hide the concrete type T
export function pack<T>(value: T, show: (v: T) => string): ExBox {
  return (k) => k({ value, show })
}

// unpack: eliminate an existential — use it without knowing T
export function unpack<R>(box: ExBox, k: <T>(b: { value: T; show: (v: T) => string }) => R): R {
  return box(k)
}

// 5. Show that a packed integer can be unpacked and shown — without revealing its type.
const _packedInt = pack(42, (n) => `number: ${n}`)
const _shown = unpack(_packedInt, (b) => b.show(b.value))
// _shown: string — the type T (number) is hidden, but we can still use `show`.

// 6. The Yoneda lemma approximation:
//    ∀R. (A → R) → R  ≅  A
//    (A type is isomorphic to its set of continuations)
type Cont<A> = <R>(k: (a: A) => R) => R

export function toCont<A>(a: A): Cont<A> {
  // YOUR CODE HERE — wrap a in continuation form
  return (k) => k(a)
}

export function fromCont<A>(cont: Cont<A>): A {
  // YOUR CODE HERE — extract A from the continuation by using identity
  return cont((a) => a)
}

export { Box }
