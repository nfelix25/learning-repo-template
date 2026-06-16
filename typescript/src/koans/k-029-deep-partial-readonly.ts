// ─── k-029: DeepPartial and DeepReadonly ─────────────────────────────────────
//
// The built-in `Partial<T>` and `Readonly<T>` only operate one level deep.
// For nested objects, you need recursive variants:
//
//   type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T
//
// The key pattern: check if T is an object (not a primitive); if so, map over
// its keys recursively; otherwise, return T unchanged.
//
// Gotchas:
//   - Arrays are objects, so `T extends object` matches them. Handle separately.
//   - Functions are objects too. You usually don't want to recurse into functions.
//   - `null` is not an object in the type system (it's a separate type).
// ─────────────────────────────────────────────────────────────────────────────

import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: DeepPartial ────────────────────────────────────────────────────────
//
// Make all properties recursively optional. Primitives pass through unchanged.

type DeepPartial<T> = T extends object
  ? { [K in keyof T]+?: DeepPartial<T[K]> }
  : T;

type _1a = Expect<
  Equal<DeepPartial<{ a: string; b: number }>, { a?: string; b?: number }>
>;

type _1b = Expect<
  Equal<
    DeepPartial<{ a: string; b: { c: number; d: boolean } }>,
    { a?: string; b?: { c?: number; d?: boolean } }
  >
>;

type _1c = Expect<Equal<DeepPartial<string>, string>>;
type _1d = Expect<Equal<DeepPartial<number>, number>>;

// ── Part 2: DeepReadonly ──────────────────────────────────────────────────────
//
// Make all properties recursively readonly. Arrays become readonly arrays.
// Primitives pass through unchanged.

type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

type _2a = Expect<
  Equal<
    DeepReadonly<{ a: string; b: number }>,
    { readonly a: string; readonly b: number }
  >
>;

type _2b = Expect<
  Equal<
    DeepReadonly<{ a: { b: string } }>,
    { readonly a: { readonly b: string } }
  >
>;

type _2c = Expect<Equal<DeepReadonly<string[]>, readonly string[]>>;
type _2d = Expect<Equal<DeepReadonly<string>, string>>;

// ── Part 3: DeepRequired ──────────────────────────────────────────────────────

type DeepRequired<T> = T extends object
  ? { [K in keyof T]-?: DeepRequired<T[K]> }
  : T;

type _3a = Expect<
  Equal<
    DeepRequired<{ a?: string; b?: { c?: number } }>,
    { a: string; b: { c: number } }
  >
>;

// ── Part 4: DeepNonNullable ───────────────────────────────────────────────────
//
// Recursively remove `null` and `undefined` from all property types.

type DeepNonNullable<T> = T extends object
  ? { [K in keyof T]: DeepNonNullable<T[K]> }
  : T extends null | undefined
    ? never
    : T;

type _4a = Expect<
  Equal<
    DeepNonNullable<{ a: string | null; b: { c: number | undefined } }>,
    { a: string; b: { c: number } }
  >
>;

// ── Part 5: ImmutableRecord — deeply readonly, required, non-nullable ─────────
//
// Combine DeepReadonly + DeepRequired + DeepNonNullable into one utility.

type ImmutableRecord<T> = T extends object
  ? { readonly [K in keyof T]-?: ImmutableRecord<T[K]> }
  : T extends null | undefined
    ? never
    : T;

type _5a = Expect<
  Equal<
    ImmutableRecord<{ a?: string | null; b: { c?: number | undefined } }>,
    { readonly a: string; readonly b: { readonly c: number } }
  >
>;

import { describe, it } from "vitest";
describe("type-level koan", () => {
  it.todo("solve via: pnpm typecheck");
});
