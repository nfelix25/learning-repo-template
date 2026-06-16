import type { Expect, Equal, TODO } from "../utils/index";

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 03 — CONDITIONAL TYPES
// Koan 4 of 5: Recursive type aliases
// ═══════════════════════════════════════════════════════════════════════════
//
// Type aliases can reference themselves, enabling recursive types that
// mirror recursive data structures or recursive algorithms.
//
//   type JSONValue =
//     | string
//     | number
//     | boolean
//     | null
//     | JSONValue[]        // ← recursive!
//     | { [key: string]: JSONValue }  // ← recursive!
//
// Like recursive functions, recursive types need:
//   1. A BASE CASE: the non-recursive branch that terminates
//   2. A RECURSIVE CASE: reduces toward the base case
//
// TypeScript evaluates recursive types LAZILY — it won't expand them
// infinitely at definition, only as needed. But infinite recursion in
// type computation will hit a depth limit.
//
// ───────────────────────────────────────────────────────────────────────────
// KOANS
// ───────────────────────────────────────────────────────────────────────────

// 1. DeepReadonly — make every property at every depth readonly.
//
//   Base case:    T is not an object → return T unchanged
//   Recursive:    T is an object → make each property readonly and recurse
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

type _test1 = Expect<
  Equal<
    DeepReadonly<{ a: string; b: number }>,
    { readonly a: string; readonly b: number }
  >
>;
type _test2 = Expect<
  Equal<
    DeepReadonly<{ a: { b: { c: string } } }>,
    { readonly a: { readonly b: { readonly c: string } } }
  >
>;
type _test3 = Expect<Equal<DeepReadonly<string>, string>>;
type _test4 = Expect<Equal<DeepReadonly<number[]>, readonly number[]>>;
//   Hint: use `T extends object` as the condition.

// 2. FlattenOnce — unwrap one level of array nesting.
//   This is non-recursive (just one level).
type FlattenOnce<T> = T extends readonly (infer E)[] ? E : T;

type _test5 = Expect<Equal<FlattenOnce<string[]>, string>>;
type _test6 = Expect<Equal<FlattenOnce<string[][]>, string[]>>;
type _test7 = Expect<Equal<FlattenOnce<number>, number>>;

// 3. DeepFlatten — unwrap ALL levels of array nesting recursively.
//   Base case:    T is not an array → return T
//   Recursive:    T is an array → flatten its elements recursively
type DeepFlatten<T> = T extends readonly (infer E)[] ? DeepFlatten<E> : T;

type _test8 = Expect<Equal<DeepFlatten<string>, string>>;
type _test9 = Expect<Equal<DeepFlatten<string[]>, string>>;
type _test10 = Expect<Equal<DeepFlatten<string[][]>, string>>;
type _test11 = Expect<Equal<DeepFlatten<string[][][]>, string>>;

// 4. JSONValue — a recursive type for JSON-compatible data.
//   Define it. No blank needed — write the type directly.
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [k: string]: JSONValue };
//   Must include: string, number, boolean, null, JSONValue[], { [k: string]: JSONValue }

// Verify it's self-referential (the following should type-check):
const _sample: JSONValue = { a: [1, "hello", { b: null, c: true }] };
void _sample;

// 5. Paths — extract all dot-notation paths of an object type.
//   This is a challenging recursive type — take it slowly.
//
//   type Obj = { a: { b: { c: string }; d: number }; e: boolean }
//   type ObjPaths = Paths<Obj>
//   // → "a" | "a.b" | "a.b.c" | "a.d" | "e"
//
type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;

type Paths<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? `${K}` | Join<K, Paths<T[K]>>
        : never;
    }[keyof T]
  : "";
//   Hint: iterate over keyof T with a mapped type, recurse if the value is an object.
//   For each key K:
//     - always include `${Prefix}${K & string}`
//     - if T[K] is an object, also include Paths<T[K], `${Prefix}${K & string}.`>

type _test12 = Expect<
  Equal<
    Paths<{ a: string; b: { c: number; d: boolean } }>,
    "a" | "b" | "b.c" | "b.d"
  >
>;

export {};
