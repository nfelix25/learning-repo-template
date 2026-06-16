import type { Expect, Equal } from '../utils/index'

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 02 — ALGEBRA OF TYPES
// Koan 2 of 7: Commutativity and associativity
// ═══════════════════════════════════════════════════════════════════════════
//
// Like set union and intersection, TypeScript's | and & are:
//
//   COMMUTATIVE:   A | B = B | A     A & B = B & A
//   ASSOCIATIVE:   (A | B) | C = A | (B | C)
//                  (A & B) & C = A & (B & C)
//
// TypeScript checks these structurally — it normalizes the representation
// and considers order-independent types equal.
//
// ───────────────────────────────────────────────────────────────────────────
// READING KOANS — all tests pass as-is
// ───────────────────────────────────────────────────────────────────────────
//
// There are no blanks here. Read the tests and make sure each one makes
// intuitive sense. If any surprises you, sit with it.

// Commutativity of |
type _comm1 = Expect<Equal<'a' | 'b', 'b' | 'a'>>
type _comm2 = Expect<Equal<string | number, number | string>>
type _comm3 = Expect<Equal<string | number | boolean, boolean | string | number>>

// Commutativity of &
type _comm4 = Expect<Equal<{ a: string } & { b: number }, { b: number } & { a: string }>>

// Associativity of |
type _assoc1 = Expect<Equal<('a' | 'b') | 'c', 'a' | ('b' | 'c')>>
type _assoc2 = Expect<Equal<(string | number) | boolean, string | (number | boolean)>>

// Associativity of &
type _assoc3 = Expect<Equal<
  ({ a: string } & { b: number }) & { c: boolean },
  { a: string } & ({ b: number } & { c: boolean })
>>

// ───────────────────────────────────────────────────────────────────────────
// A NOTE ON REPRESENTATION
// ───────────────────────────────────────────────────────────────────────────
//
// TypeScript stores union types as SORTED, DEDUPLICATED sets internally.
// That's why `'a' | 'b'` and `'b' | 'a'` are the same type — they have
// the same canonical form.
//
// This is different from, say, function parameter types — where order matters:
//   (a: string, b: number) ≠ (a: number, b: string)
//
// Unions and intersections don't have positional semantics, so order is irrelevant.

export {}
