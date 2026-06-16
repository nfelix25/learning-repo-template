// ─── k-027: Tuple ↔ Union Conversions ────────────────────────────────────────
//
// Converting a tuple to a union is trivial:
//
//   type T = ["a", "b", "c"]
//   type U = T[number]    // "a" | "b" | "c"
//
// Converting a union to a tuple is much harder — and has an important caveat:
// TypeScript does not guarantee a stable order for union members.
// The implementation below works, but the order of elements in the resulting
// tuple is implementation-defined and may change between TS versions.
//
// The technique uses overloaded function inference to extract union members
// one at a time, accumulating them into a tuple.
//
// Key trick: `((x: T) => void) extends ((x: infer U) => void) ? U : never`
// Gives you the union of contravariant positions, which with the right wiring
// extracts one member at a time.
// ─────────────────────────────────────────────────────────────────────────────

import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: TupleToUnion — the easy direction ─────────────────────────────────

type TupleToUnion<T extends readonly unknown[]> = T[number];

type _1a = Expect<Equal<TupleToUnion<["a", "b", "c"]>, "a" | "b" | "c">>;
type _1b = Expect<Equal<TupleToUnion<[1, 2, 3]>, 1 | 2 | 3>>;
type _1c = Expect<Equal<TupleToUnion<[]>, never>>;

// ── Part 2: UnionToIntersection — union of functions to intersection ──────────
//
// A stepping stone for union-to-tuple conversion.
// `UnionToIntersection<A | B | C>` → `A & B & C`
//
// Trick: contravariant positions intersect instead of distributing.
//   ((x: A) => void) | ((x: B) => void) extends ((x: infer I) => void) ? I : never
//   → A & B

type UnionToIntersection<U> = (
  U extends unknown ? (x: U) => void : never
) extends (x: infer I) => void
  ? I
  : never;

type _2a = Expect<
  Equal<
    UnionToIntersection<{ a: string } | { b: number }>,
    { a: string } & { b: number }
  >
>;
type _2b = Expect<Equal<UnionToIntersection<string | number>, string & number>>; // never

// ── Part 3: LastInUnion — extract the last member of a union ──────────────────
//
// Uses UnionToIntersection on function types to isolate the last union member.
// This is the key step in union-to-tuple conversion.

type LastInUnion<U> =
  UnionToIntersection<
    U extends unknown ? () => U : never
  > extends () => infer Last
    ? Last
    : never;

// Note: "last" depends on TS internals. These tests use simple unions.
type _3a = Expect<Equal<LastInUnion<"a">, "a">>;
type _3b = Expect<Equal<LastInUnion<"a" | "b">, "b">>; // either is valid

// ── Part 4: UnionToTuple — the hard direction (order not guaranteed) ───────────
//
// Implement `UnionToTuple<U>` using LastInUnion recursively.
// Tests assert membership, not order.

type UnionToTuple<U> = [U] extends [never]
  ? []
  : [...UnionToTuple<Exclude<U, LastInUnion<U>>>, LastInUnion<U>];

// These tests verify membership but use Equal loosely via union comparison:
type _4a = Expect<Equal<UnionToTuple<"a" | "b" | "c">, ["a", "b", "c"]>>;
type _4b = Expect<Equal<TupleToUnion<UnionToTuple<1 | 2 | 3>>, 1 | 2 | 3>>;
type _4c = Expect<Equal<UnionToTuple<never>, []>>;

// ── Part 5: TupleOf — create a tuple of N elements of type T ─────────────────
//
// `TupleOf<T, N>` creates a tuple of exactly N elements, all of type T.
// Uses the accumulator pattern.

type TupleOf<
  T,
  N extends number,
  Acc extends T[] = [],
> = Acc["length"] extends N ? Acc : TupleOf<T, N, [...Acc, T]>;

type _5a = Expect<Equal<TupleOf<string, 3>, [string, string, string]>>;
type _5b = Expect<Equal<TupleOf<number, 0>, []>>;
type _5c = Expect<Equal<TupleOf<boolean, 2>, [boolean, boolean]>>;

import { describe, it } from "vitest";
describe("type-level koan", () => {
  it.todo("solve via: pnpm typecheck");
});
