// ─── k-014: Filtering with never in Mapped Types ─────────────────────────────
//
// In the type system, `never` is the empty type — no value can have type `never`.
// In a union, `never` disappears: `string | never = string`.
// In a mapped type's `as` clause, mapping a key to `never` removes that key.
//
// This enables property filtering:
//
//   type FunctionKeys<T> = {
//     [K in keyof T as T[K] extends (...args: any[]) => any ? K : never]: T[K]
//   }
//
// The conditional in `as` maps non-function keys to `never`, dropping them.
// Function keys are kept with their original name.
//
// This is the synthesis koan for Phases 3 mapped types. You'll combine
// key remapping, modifiers, and never-filtering to build practical utilities.
// ─────────────────────────────────────────────────────────────────────────────

import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: FunctionKeys — keep only method properties ───────────────────────

type FunctionKeys<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any ? K : never]: T[K];
};

type _1a = Expect<
  Equal<
    FunctionKeys<{
      name: string;
      greet: () => void;
      age: number;
      run: (speed: number) => void;
    }>,
    { greet: () => void; run: (speed: number) => void }
  >
>;

// ── Part 2: NonFunctionKeys — keep only data properties ──────────────────────

type NonFunctionKeys<T> = {
  [K in keyof T as T[K] extends (...args: any) => any ? never : K]: T[K];
};

type _2a = Expect<
  Equal<
    NonFunctionKeys<{ name: string; greet: () => void; age: number }>,
    { name: string; age: number }
  >
>;

// ── Part 3: OmitByValue — remove properties matching a value type ─────────────
//
// A more general version: filter any value type, not just functions.
// (You saw a version in k-012; build a cleaner one here using explicit never.)

type OmitByType<T, V> = { [K in keyof T as T[K] extends V ? never : K]: T[K] };

type _3a = Expect<
  Equal<
    OmitByType<{ a: string; b: number; c: string; d: boolean }, string>,
    { b: number; d: boolean }
  >
>;

type _3b = Expect<
  Equal<
    OmitByType<
      { fn: () => void; data: string; cb: (x: number) => number },
      Function
    >,
    { data: string }
  >
>;

// ── Part 4: NullableKeys / RequiredKeys ──────────────────────────────────────
//
// `NullableKeys<T>` is a union of the key names whose value type includes null.
// `RequiredKeys<T>` is a union of the key names that are required (not optional).
//
// These produce a union of key strings, not an object type.

type NullableKeys<T> = {
  [K in keyof T]: null extends T[K] ? K : never;
}[keyof T];

type _4a = Expect<
  Equal<
    NullableKeys<{ a: string | null; b: number; c: boolean | null }>,
    "a" | "c"
  >
>;

type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

type _4b = Expect<
  Equal<
    RequiredKeys<{ a: string; b?: number; c: boolean; d?: string }>,
    "a" | "c"
  >
>;

// ── Part 5: Flip — swap keys and values ──────────────────────────────────────
//
// `Flip<T>` swaps the keys and values of an object type.
// Only valid when values are strings or number literals (valid key types).

type Flip<T extends Record<string, string | number | symbol>> = {
  [K in keyof T as T[K]]: K;
};

type _5a = Expect<
  Equal<Flip<{ a: "x"; b: "y"; c: "z" }>, { x: "a"; y: "b"; z: "c" }>
>;

import { describe, it } from "vitest";
describe("type-level koan", () => {
  it.todo("solve via: pnpm typecheck");
});
