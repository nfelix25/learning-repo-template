// ─── k-016: Distributive Conditional Types ───────────────────────────────────
//
// When the checked type in a conditional is a *bare type parameter*, TypeScript
// distributes the conditional over union members:
//
//   type Dist<T> = T extends string ? "yes" : "no"
//   type R = Dist<string | number>
//   // distributes: (string extends string ? "yes" : "no") | (number extends string ? "yes" : "no")
//   // result: "yes" | "no"
//
// If T were NOT a bare parameter, distribution does NOT happen:
//
//   type NonDist<T> = [T] extends [string] ? "yes" : "no"
//   type R = NonDist<string | number>
//   // [string | number] extends [string] ? "yes" : "no"
//   // result: "no"  (the union is treated as a whole)
//
// Distribution enables powerful filtering operations on union types.
// The built-in `Exclude<T, U>` and `Extract<T, U>` work by distribution.
// ─────────────────────────────────────────────────────────────────────────────

import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: Distributive vs non-distributive — spot the difference ───────────
//
// `IsString<T>` distributes over unions.
// `IsStringNonDist<T>` wraps in tuples to prevent distribution.

type IsString<T> = T extends string ? "string" : "no";
type IsStringNonDist<T> = [T] extends [string] ? "no" : "no";

type _1a = Expect<Equal<IsString<string | number>, "string" | "no">>;
type _1b = Expect<Equal<IsStringNonDist<string | number>, "no">>;
type _1c = Expect<Equal<IsString<never>, never>>; // distributes over empty union = never
type _1d = Expect<Equal<IsStringNonDist<never>, "no">>; // [never] extends [string] is false

// ── Part 2: MyExclude — build Exclude<T, U> from scratch ─────────────────────
//
// `MyExclude<T, U>` removes from T all members assignable to U.
// Distribution makes this a one-liner.

// Because T is naked on the left side of extends, this distributes over unions
type MyExclude<T, U> = T extends U ? never : T;

type _2a = Expect<
  Equal<MyExclude<string | number | boolean, string>, number | boolean>
>;
type _2b = Expect<Equal<MyExclude<"a" | "b" | "c", "a" | "c">, "b">>;
type _2c = Expect<Equal<MyExclude<string | number, never>, string | number>>;
type _2d = Expect<Equal<MyExclude<string | number, string | number>, never>>;

// ── Part 3: MyExtract — build Extract<T, U> from scratch ─────────────────────

type MyExtract<T, U> = U extends T ? U : never;

type _3a = Expect<
  Equal<
    MyExtract<string | number | boolean, string | boolean>,
    string | boolean
  >
>;
type _3b = Expect<Equal<MyExtract<"a" | "b" | "c", "a" | "d">, "a">>;
type _3c = Expect<Equal<MyExtract<string, number>, never>>;

// ── Part 4: NonNullableUnion — remove null and undefined from a union ─────────
//
// `NonNullableUnion<T>` removes `null` and `undefined` from union T.
// Equivalent to built-in `NonNullable<T>` — build it from Exclude.

type NonNullableUnion<T> = T extends null | undefined ? never : T;

type _4a = Expect<Equal<NonNullableUnion<string | null | undefined>, string>>;
type _4b = Expect<Equal<NonNullableUnion<number | null>, number>>;
type _4c = Expect<Equal<NonNullableUnion<boolean>, boolean>>;

// ── Part 5: DistributiveOmit — Omit that distributes over discriminated unions
//
// The built-in `Omit<T, K>` does NOT distribute over unions. This matters for
// discriminated unions where you want to remove a key from each member independently.
//
// `DistributiveOmit<T, K>` applies `Omit<each member, K>` via distribution.

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Pick<T, Exclude<keyof T, K>> // Just a drawn out Omit<T, K>
  : never;

type Shape =
  | { kind: "circle"; radius: number; color: string }
  | { kind: "rectangle"; width: number; height: number; color: string };

type _5a = Expect<
  Equal<
    DistributiveOmit<Shape, "color">,
    | { kind: "circle"; radius: number }
    | { kind: "rectangle"; width: number; height: number }
  >
>;

import { describe, it } from "vitest";
describe("type-level koan", () => {
  it.todo("solve via: pnpm typecheck");
});
