// ─── k-010: Mapped Types — Basics ────────────────────────────────────────────
//
// A mapped type iterates over the keys of an existing type and transforms them:
//
//   type Readonly<T> = { readonly [K in keyof T]: T[K] }
//
// Breaking it down:
//   [K in keyof T]  — for each key K of T
//   : T[K]          — the value type is T[K] (the type at that key)
//   readonly        — add readonly modifier
//
// Mapped types are the foundation of TypeScript's built-in utility types.
// Building them from scratch forces you to understand exactly what they do.
//
// The iteration `[K in keyof T]` distributes over each key individually,
// like a for-loop over the type system. Each K is a key of T, so T[K]
// is well-typed and never `any`.
// ─────────────────────────────────────────────────────────────────────────────

import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: MyReadonly ────────────────────────────────────────────────────────
//
// Build `MyReadonly<T>`: makes all properties of T readonly.
// Do not use the built-in `Readonly<T>` — build it from scratch.

type MyReadonly<T> = { readonly [K in keyof T]: T[K] };

type _1a = Expect<
  Equal<
    MyReadonly<{ a: string; b: number }>,
    { readonly a: string; readonly b: number }
  >
>;
type _1b = Expect<Equal<MyReadonly<{ x: boolean }>, Readonly<{ x: boolean }>>>;

// ── Part 2: MyPartial ─────────────────────────────────────────────────────────
//
// Build `MyPartial<T>`: makes all properties optional.
// Do not use the built-in `Partial<T>`.

type MyPartial<T> = { [K in keyof T]?: T[K] };

type _2a = Expect<
  Equal<MyPartial<{ a: string; b: number }>, { a?: string; b?: number }>
>;
type _2b = Expect<Equal<MyPartial<{ x: boolean }>, Partial<{ x: boolean }>>>;

// ── Part 3: Nullable — transforming value types ────────────────────────────────
//
// `Nullable<T>` adds `| null` to every property's type.
// The keys are unchanged; only the value types are transformed.

type Nullable<T> = { [K in keyof T]: T[K] | null };

type _3a = Expect<
  Equal<
    Nullable<{ a: string; b: number }>,
    { a: string | null; b: number | null }
  >
>;
type _3b = Expect<
  Equal<
    Nullable<{ x: boolean; y: string[] }>,
    { x: boolean | null; y: string[] | null }
  >
>;

// ── Part 4: ReadonlyRecord — mapped type from a union ─────────────────────────
//
// `ReadonlyRecord<K, V>` maps a union of string literals K to values of type V.
// Similar to built-in `Record<K, V>` but all properties are readonly.

type ReadonlyRecord<K extends string, V> = { readonly [S in K]: V };

type _4a = Expect<
  Equal<
    ReadonlyRecord<"a" | "b" | "c", number>,
    { readonly a: number; readonly b: number; readonly c: number }
  >
>;
type _4b = Expect<
  Equal<ReadonlyRecord<"x", boolean[]>, { readonly x: boolean[] }>
>;

// ── Part 5: Mutable — removing readonly from all properties ───────────────────
//
// `Mutable<T>` is the inverse of Readonly: it removes `readonly` from all properties.
// You'll need the `-readonly` modifier syntax.

type Mutable<T> = { -readonly [K in keyof T]: T[K] };

type _5a = Expect<
  Equal<
    Mutable<{ readonly a: string; readonly b: number }>,
    { a: string; b: number }
  >
>;
type _5b = Expect<Equal<Mutable<Readonly<{ x: boolean }>>, { x: boolean }>>;

import { describe, it } from "vitest";
describe("type-level koan", () => {
  it.todo("solve via: pnpm typecheck");
});
