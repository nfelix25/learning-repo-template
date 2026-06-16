import type { Expect, Equal } from '../utils/index'

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 01 — TYPES AS SETS
// Koan 1 of 8: What is a type?
// ═══════════════════════════════════════════════════════════════════════════
//
// READING KOAN — no blanks to fill in. Read carefully; this vocabulary
// carries through every module that follows.
//
// ───────────────────────────────────────────────────────────────────────────
// THE CORE IDEA
// ───────────────────────────────────────────────────────────────────────────
//
// A TYPE IS A SET OF VALUES.
//
// That's it. That's the whole mental model. Every type in TypeScript —
// no matter how complex — is just a set of values that belong to it.
//
//   string   =  { "", "a", "hello", "world", ... }   (infinite)
//   number   =  { 0, 1, -1, 3.14, NaN, Infinity, ... }   (infinite)
//   boolean  =  { true, false }   (exactly two members)
//   null     =  { null }   (exactly one member)
//   "cat"    =  { "cat" }   (exactly one member — a literal type)
//   42       =  { 42 }   (exactly one member — a literal type)
//
// When you write:
//
//   const x: string = "hello"
//
// You're saying: "x must be a member of the set of all strings."
// TypeScript checks: is "hello" ∈ string? Yes. Type-safe.
//
// ───────────────────────────────────────────────────────────────────────────
// NOTATION WE'LL USE THROUGHOUT THE KOANS
// ───────────────────────────────────────────────────────────────────────────
//
//   ∈   "is a member of"       (value belongs to type)
//   ⊆   "is a subset of"       (type is a subtype of another)
//   ∪   set union              (TypeScript: A | B)
//   ∩   set intersection       (TypeScript: A & B)
//   ∅   the empty set          (TypeScript: never)
//   𝕌   the universal set      (TypeScript: unknown)
//   λ   lambda (function)      (TypeScript: generics)
//
// ───────────────────────────────────────────────────────────────────────────
// WHY THIS MATTERS
// ───────────────────────────────────────────────────────────────────────────
//
// Once you see types as sets, many "surprising" TypeScript behaviors
// become obvious:
//
//   Q: Why does { name: string; age: number } fit where { name: string }
//      is expected?
//   A: Because { name: string; age: number } ⊆ { name: string } —
//      every value with name+age also has name.
//
//   Q: Why does string | never simplify to string?
//   A: Because A ∪ ∅ = A — unioning with the empty set changes nothing.
//
//   Q: Why can you assign a `never` value to any type?
//   A: Because ∅ ⊆ A for every set A — the empty set is a subset of everything.
//
// These aren't rules you memorize. They follow from the math.
//
// ───────────────────────────────────────────────────────────────────────────
// SOME OBSERVABLE FACTS (all pass — nothing to fill in)
// ───────────────────────────────────────────────────────────────────────────

// boolean is exactly two values: true and false
type _booleanIsSmall = Expect<Equal<boolean, true | false>>

// A literal type has exactly one member
const _catValue = 'cat' as const
type _literalIsSingleton = Expect<Equal<typeof _catValue, 'cat'>>

// A const variable keeps its literal type
const greeting = 'hello' as const
type _constKeepsLiteral = Expect<Equal<typeof greeting, 'hello'>>

// A let variable widens to its primitive type
// (because it could be reassigned to any string)
// We'll return to widening in koan 04.

export {}
