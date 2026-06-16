// ─── k-011: Mapped Type Modifiers (+/- readonly and optional) ────────────────
//
// Mapped types can add or remove the `readonly` and `?` (optional) modifiers
// using a `+` or `-` prefix. Without a prefix, `+` is implied.
//
//   { [K in keyof T]+?: T[K] }  ← makes all optional (same as { [K in keyof T]?: ... })
//   { [K in keyof T]-?: T[K] }  ← removes optional (Required<T>)
//   { +readonly [K in keyof T]: T[K] }  ← adds readonly
//   { -readonly [K in keyof T]: T[K] }  ← removes readonly (Mutable<T>)
//
// Why does `-?` exist? Because you cannot express "remove optionality" with
// just `?` — the `?` modifier always *adds* or *keeps* optionality.
// The minus prefix was added specifically for this.
//
// Modifiers can be combined: `-readonly [K in keyof T]-?` removes both.
// ─────────────────────────────────────────────────────────────────────────────

import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: MyRequired — using -? ─────────────────────────────────────────────
//
// `MyRequired<T>` removes optionality from all properties.
// Equivalent to the built-in `Required<T>`. Build it without using it.

type MyRequired<T> = { [K in keyof T]-?: T[K] };

type _1a = Expect<
  Equal<MyRequired<{ a?: string; b?: number }>, { a: string; b: number }>
>;
type _1b = Expect<
  Equal<MyRequired<{ x?: boolean; y: string }>, { x: boolean; y: string }>
>;

// ── Part 2: Concrete — removes both readonly and optional ─────────────────────
//
// `Concrete<T>` strips both `readonly` and `?` from all properties.

type Concrete<T> = { -readonly [K in keyof T]-?: T[K] };

type _2a = Expect<
  Equal<
    Concrete<{ readonly a?: string; readonly b: number; c?: boolean }>,
    { a: string; b: number; c: boolean }
  >
>;

// ── Part 3: PartialExcept — partial, but some keys stay required ──────────────
//
// `PartialExcept<T, K>` makes all properties of T optional, except the keys
// in K which remain required.
//
// Hint: intersection types let you combine two mapped types.

type Simplify<T> = {
  [P in keyof T]: T[P];
};

type PartialExcept<T, K extends keyof T> = Simplify<
  {
    [P in K]-?: T[P];
  } & {
    [P in Exclude<keyof T, K>]?: T[P];
  }
>;

type _3a = Expect<
  Equal<
    PartialExcept<{ id: string; name: string; email: string }, "id">,
    { id: string; name?: string; email?: string }
  >
>;

type _3b = Expect<
  Equal<
    PartialExcept<{ a: number; b: string; c: boolean }, "a" | "c">,
    { a: number; b?: string; c: boolean }
  >
>;

// ── Part 4: DeepMutable — recursively remove readonly ────────────────────────
//
// `DeepMutable<T>` removes readonly recursively — from nested objects and arrays.
// Primitives pass through unchanged.

type DeepMutable<T> = T extends object
  ? { -readonly [K in keyof T]: DeepMutable<T[K]> }
  : T;

type _4a = Expect<
  Equal<
    DeepMutable<{ readonly a: { readonly b: string } }>,
    { a: { b: string } }
  >
>;

type _4b = Expect<
  Equal<
    DeepMutable<readonly [string, readonly [number, boolean]]>,
    [string, [number, boolean]]
  >
>;

type _4c = Expect<Equal<DeepMutable<string>, string>>;
type _4d = Expect<Equal<DeepMutable<readonly string[]>, string[]>>;

// ── Part 5: NonNullableProperties — remove null/undefined from all value types
//
// `NonNullableProperties<T>` applies `NonNullable<>` to every property's value type,
// removing null and undefined from the value, not from the key presence.

type NonNullableProperties<T> = { [K in keyof T]: NonNullable<T[K]> };

type _5a = Expect<
  Equal<
    NonNullableProperties<{
      a: string | null;
      b: number | undefined;
      c: boolean;
    }>,
    { a: string; b: number; c: boolean }
  >
>;

import { describe, it } from "vitest";
describe("type-level koan", () => {
  it.todo("solve via: pnpm typecheck");
});
