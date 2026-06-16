// ─── k-024: Tuple Types and Labeled Elements ─────────────────────────────────
//
// Tuples are fixed-length arrays where each position has its own type:
//
//   type Point = [x: number, y: number]      // labeled
//   type Pair  = [string, number]             // unlabeled
//   type Mixed = [first: string, ...rest: number[]]  // with rest
//   type Opt   = [string, number?]            // optional last element
//
// Key operations:
//   T[0]         → type of first element
//   T["length"]  → numeric literal length (for fixed tuples)
//   T[number]    → union of all element types
//
// Labeled elements (`x: number`) are purely documentary — they don't affect
// structural compatibility. A `[x: number]` is assignable to `[number]`.
//
// Rest elements can appear in the middle (variadic tuples in k-025):
//   [string, ...number[], boolean]  // middle rest is fine in TS 4.0+
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: Labeled tuple element types ──────────────────────────────────────

type RGB = [r: number, g: number, b: number];

type _1a = Expect<Equal<RGB[0], number>>;
type _1b = Expect<Equal<RGB[1], number>>;
type _1c = Expect<Equal<RGB["length"], 3>>;
type _1d = Expect<Equal<RGB[number], number>>; // union of all element types

// ── Part 2: Optional tuple elements ──────────────────────────────────────────
//
// Build a `HttpResponse` tuple: status code (required), body (required),
// and optional headers object.

type HttpResponse = [number, string, headers?: Record<string, string>]; // [status: number, body: string, headers?: Record<string, string>]

type _2a = Expect<Equal<HttpResponse[0], number>>;
type _2b = Expect<Equal<HttpResponse[1], string>>;
type _2c = Expect<Equal<HttpResponse[2], Record<string, string> | undefined>>;
type _2d = Expect<Equal<HttpResponse["length"], 2 | 3>>;

// ── Part 3: Tuple to union ────────────────────────────────────────────────────
//
// `TupleToUnion<T>` extracts the union of all element types from a tuple.
// Equivalent to T[number] but expressed as a named utility type.

type TupleToUnion<T extends readonly unknown[]> = T[number];

type _3a = Expect<
  Equal<TupleToUnion<[string, number, boolean]>, string | number | boolean>
>;
type _3b = Expect<Equal<TupleToUnion<["a", "b", "c"]>, "a" | "b" | "c">>;
type _3c = Expect<Equal<TupleToUnion<[never]>, never>>;
type _3d = Expect<Equal<TupleToUnion<[]>, never>>;

// ── Part 4: Head and Tail ─────────────────────────────────────────────────────
//
// `Head<T>` extracts the first element type.
// `Tail<T>` extracts all but the first element as a tuple.

type Head<T extends readonly unknown[]> = T extends [infer head, ...any[]]
  ? head
  : never;
type Tail<T extends readonly unknown[]> = T extends [any, ...infer tail]
  ? tail
  : never;

type _4a = Expect<Equal<Head<[string, number, boolean]>, string>>;
type _4b = Expect<Equal<Head<[42]>, 42>>;
type _4c = Tail<[string, number, boolean]>;
type _4d = Expect<Equal<Tail<[string]>, []>>;

// ── Part 5: Tuple zip ─────────────────────────────────────────────────────────
//
// `Zip<A, B>` pairs elements from two tuples at the same index.
// Both tuples must have the same length.
// [string, number] zip ["a", "b"] → [[string, "a"], [number, "b"]]

type Zip<
  A extends readonly unknown[],
  B extends readonly unknown[],
> = A["length"] extends B["length"]
  ? A extends [infer AHead, ...infer ATail]
    ? B extends [infer BHead, ...infer BTail]
      ? [[AHead, BHead], ...Zip<ATail, BTail>]
      : []
    : []
  : [];

type _5a = Expect<
  Equal<Zip<[string, number], ["a", "b"]>, [[string, "a"], [number, "b"]]>
>;
type _5b = Expect<Equal<Zip<[1, 2, 3], [4, 5, 6]>, [[1, 4], [2, 5], [3, 6]]>>;
type _5c = Expect<Equal<Zip<[], []>, []>>;

// ── Part 6: Runtime — destructuring and rest ─────────────────────────────────

function swap<A, B>(pair: [A, B]): [B, A] {
  return [pair[1], pair[0]];
}

const _sw = swap(["hello", 42]);
type _6a = Expect<Equal<typeof _sw, [number, string]>>;

describe("swap", () => {
  it("swaps a pair", () => {
    expect(swap(["hello", 42])).toEqual([42, "hello"]);
  });
});
