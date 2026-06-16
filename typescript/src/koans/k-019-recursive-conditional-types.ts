// ─── k-019: Recursive Conditional Types ──────────────────────────────────────
//
// Conditional types can reference themselves to recurse over nested structures.
// TypeScript evaluates recursive conditionals lazily (deferred evaluation),
// which allows them to handle arbitrarily deep nesting:
//
//   type Flatten<T> = T extends Array<infer E> ? Flatten<E> : T
//   // Flatten<number[][][]> → Flatten<number[][]> → Flatten<number[]> → number
//
// Limitations: TypeScript limits recursion depth (typically ~1000 levels for
// tuple-counting tricks). For practical types, depth is rarely an issue.
//
// Pattern: recursive = conditional + infer + self-reference in true branch.
// The false branch is the base case (what to return when recursion stops).
// ─────────────────────────────────────────────────────────────────────────────

import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: Flatten — recursively unwrap nested arrays ───────────────────────

type Flatten<T> = T extends Array<infer E> ? Flatten<E> : T;

type _1a = Expect<Equal<Flatten<number>, number>>;
type _1b = Expect<Equal<Flatten<number[]>, number>>;
type _1c = Expect<Equal<Flatten<number[][]>, number>>;
type _1d = Expect<Equal<Flatten<number[][][]>, number>>;
type _1e = Expect<Equal<Flatten<string>, string>>;

// ── Part 2: DeepAwaited — recursively unwrap nested Promises ──────────────────

type DeepAwaited<T> = T extends Promise<infer E> ? DeepAwaited<E> : T;

type _2a = Expect<Equal<DeepAwaited<string>, string>>;
type _2b = Expect<Equal<DeepAwaited<Promise<string>>, string>>;
type _2c = Expect<Equal<DeepAwaited<Promise<Promise<string>>>, string>>;
type _2d = Expect<Equal<DeepAwaited<Promise<number[]>>, number[]>>; // stops at non-Promise

// ── Part 3: NestedKeys — flatten nested object key paths ─────────────────────
//
// `NestedKeyPaths<T>` generates all dot-separated key paths in T (preview of k-030).
// Stop recursion at primitives and arrays.

type Primitive = string | number | boolean | null | undefined | symbol | bigint;

type NestedKeyPaths<T, Prefix extends string = ""> = T extends
  | Primitive
  | readonly unknown[]
  ? never
  : {
      [K in keyof T & string]: T[K] extends Primitive | readonly unknown[]
        ? `${Prefix}${Prefix extends "" ? "" : "."}${K}`
        :
            | `${Prefix}${Prefix extends "" ? "" : "."}${K}`
            | NestedKeyPaths<
                T[K],
                `${Prefix}${Prefix extends "" ? "" : "."}${K}`
              >;
    }[keyof T & string];

type _3a = Expect<Equal<NestedKeyPaths<{ a: string }>, "a">>;

type _3b = Expect<
  Equal<NestedKeyPaths<{ a: { b: string; c: number } }>, "a" | "a.b" | "a.c">
>;

type _3c = Expect<
  Equal<NestedKeyPaths<{ a: { b: { c: boolean } } }>, "a" | "a.b" | "a.b.c">
>;

// ── Part 4: Depth — count nesting depth of an array type ─────────────────────
//
// `ArrayDepth<T>` returns the nesting depth of an array type as a number literal.
// Uses the "accumulator tuple" trick to count recursively.

type ArrayDepth<T, Acc extends unknown[] = []> =
  T extends Array<infer E> ? ArrayDepth<E, [...Acc, unknown]> : Acc["length"];

type _4a = Expect<Equal<ArrayDepth<string>, 0>>;
type _4b = Expect<Equal<ArrayDepth<string[]>, 1>>;
type _4c = Expect<Equal<ArrayDepth<string[][]>, 2>>;
type _4d = Expect<Equal<ArrayDepth<string[][][]>, 3>>;

import { describe, it } from "vitest";
describe("type-level koan", () => {
  it.todo("solve via: pnpm typecheck");
});
