// ─── k-025: Spread in Tuple Types ────────────────────────────────────────────
//
// Tuples support spread syntax at the type level:
//
//   type A = [string, ...number[], boolean]  // string, then any number of numbers, then boolean
//   type B = [...A, Date]                    // spreads A and appends Date
//
// Spread enables generic tuple manipulation:
//
//   type Prepend<E, T extends unknown[]> = [E, ...T]
//   Prepend<string, [number, boolean]> → [string, number, boolean]
//
// Rules:
//   - Only one variadic (rest) element per tuple
//   - Variadic element can be at the start, middle, or end
//   - Combining two variadic tuples: [...A, ...B] — A or B must be non-variadic
// ─────────────────────────────────────────────────────────────────────────────

import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: Prepend and Append ─────────────────────────────────────────────────

type Prepend<E, T extends readonly unknown[]> = [E, ...T];
type Append<T extends readonly unknown[], E> = [...T, E];

type _1a = Expect<
  Equal<Prepend<string, [number, boolean]>, [string, number, boolean]>
>;
type _1b = Expect<Equal<Prepend<0, []>, [0]>>;
type _1c = Expect<
  Equal<Append<[string, number], boolean>, [string, number, boolean]>
>;
type _1d = Expect<Equal<Append<[], "end">, ["end"]>>;

// ── Part 2: Concat ────────────────────────────────────────────────────────────

type Concat<A extends readonly unknown[], B extends readonly unknown[]> = [
  ...A,
  ...B,
];

type _2a = Expect<
  Equal<
    Concat<[string, number], [boolean, Date]>,
    [string, number, boolean, Date]
  >
>;
type _2b = Expect<Equal<Concat<[], [1, 2, 3]>, [1, 2, 3]>>;
type _2c = Expect<Equal<Concat<[string], []>, [string]>>;

// ── Part 3: Reverse ────────────────────────────────────────────────────────────
//
// `Reverse<T>` reverses the order of elements in a tuple.
// This requires recursion — peel off the first element and append it at the end.

type Reverse<
  T extends readonly unknown[],
  Acc extends readonly unknown[] = [],
> = T extends [infer Head, ...infer Tail] ? Reverse<Tail, [Head, ...Acc]> : Acc;

type _3a = Expect<
  Equal<Reverse<[string, number, boolean]>, [boolean, number, string]>
>;
type _3b = Expect<Equal<Reverse<[1, 2, 3]>, [3, 2, 1]>>;
type _3c = Expect<Equal<Reverse<[]>, []>>;
type _3d = Expect<Equal<Reverse<["only"]>, ["only"]>>;

// ── Part 4: Flatten tuple (one level) ─────────────────────────────────────────
//
// `FlatTuple<T>` flattens a tuple of tuples into a single tuple (one level).

type FlatTuple<T extends readonly (readonly unknown[])[]> = T extends readonly [
  infer Head extends readonly unknown[],
  ...infer Tail extends readonly (readonly unknown[])[],
]
  ? [...Head, ...FlatTuple<Tail>]
  : [];

type _4a = Expect<Equal<FlatTuple<[[1, 2], [3, 4], [5]]>, [1, 2, 3, 4, 5]>>;
type _4b = Expect<Equal<FlatTuple<[[string], [number]]>, [string, number]>>;
type _4c = Expect<Equal<FlatTuple<[[]]>, []>>;

// ── Part 5: ZipTuples — zip N tuples of the same length ─────────────────────
//
// `ZipWith<T extends unknown[][]>` creates a tuple of tuples,
// where the Nth element contains the Nth element from each input tuple.
// Only implement for fixed-length 2-element input (a pair of tuples).

type ZipWith<
  A extends readonly unknown[],
  B extends readonly unknown[],
> = A extends [infer AHead, ...infer ATail]
  ? B extends [infer BHead, ...infer BTail]
    ? [[AHead, BHead], ...ZipWith<ATail, BTail>]
    : []
  : [];

type _5a = Expect<
  Equal<ZipWith<[1, 2, 3], ["a", "b", "c"]>, [[1, "a"], [2, "b"], [3, "c"]]>
>;
type _5b = Expect<Equal<ZipWith<[string], [number]>, [[string, number]]>>;

import { describe, it } from "vitest";
describe("type-level koan", () => {
  it.todo("solve via: pnpm typecheck");
});
