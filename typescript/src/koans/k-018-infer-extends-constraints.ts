// ─── k-018: infer with extends Constraints (TypeScript 5.4) ──────────────────
//
// Before TS 5.4, infer captured any type, and you'd need a follow-on conditional
// to narrow the captured type:
//
//   type GetString<T> =
//     T extends { tag: infer R }         // R is unknown here
//       ? R extends string ? R : never   // second conditional to narrow
//       : never
//
// TypeScript 5.4 allows a constraint directly on infer:
//
//   type GetString<T> = T extends { tag: infer R extends string } ? R : never
//
// The constraint is both an infer declaration AND a type check:
// - If the captured type satisfies `extends string`, R is inferred as that type.
// - If not, the whole condition is false — no second conditional needed.
//
// This eliminates boilerplate and makes the intent clearer.
// ─────────────────────────────────────────────────────────────────────────────

import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: Extract a string-typed property ──────────────────────────────────
//
// `GetTag<T>` extracts the `tag` property's type, but only if it's a string.
// Use `infer R extends string` to combine infer and constraint.

type GetTag<T> = T extends { tag: infer V extends string } ? V : never;

type _1a = Expect<Equal<GetTag<{ tag: "hello" }>, "hello">>;
type _1b = Expect<Equal<GetTag<{ tag: "a" | "b" }>, "a" | "b">>;
type _1c = Expect<Equal<GetTag<{ tag: number }>, never>>; // number doesn't extend string
type _1d = Expect<Equal<GetTag<{}>, never>>; // no tag property

// ── Part 2: Contrast with pre-5.4 pattern ───────────────────────────────────
//
// Write the pre-5.4 version of GetTag using two conditional types.
// They must produce identical results — this koan shows what 5.4 simplifies.

type GetTagOld<T> = T extends { tag: infer V }
  ? V extends string
    ? V
    : never // second conditional here to narrow R to string
  : never;

type _2a = Expect<Equal<GetTagOld<{ tag: "hello" }>, "hello">>;
type _2b = Expect<Equal<GetTagOld<{ tag: number }>, never>>;

// ── Part 3: Extract a numeric literal from a tuple's first element ────────────
//
// `FirstNumber<T>` extracts the first element of a tuple, but only if it's a number.

type FirstNumber<T extends any[]> = T extends [
  first: infer V extends number,
  ...rest: any[],
]
  ? V
  : never;

type _3a = Expect<Equal<FirstNumber<[42, string]>, 42>>;
type _3b = Expect<Equal<FirstNumber<[number, string]>, number>>;
type _3c = Expect<Equal<FirstNumber<["hello", number]>, never>>; // string doesn't extend number

// ── Part 4: Extract and constrain from a union ────────────────────────────────
//
// `TaggedValue<T, Tag extends string>` extracts the value type from a discriminated
// union member whose `type` field matches Tag.
//
//   type Actions = { type: "add"; payload: string } | { type: "remove"; payload: number }
//   TaggedValue<Actions, "add"> → string

type TaggedValue<T, Tag extends string> = T extends {
  type: Tag;
  payload: infer P;
}
  ? P
  : never;

type Actions =
  | { type: "add"; payload: string }
  | { type: "remove"; payload: number }
  | { type: "reset"; payload: null };

type _4a = Expect<Equal<TaggedValue<Actions, "add">, string>>;
type _4b = Expect<Equal<TaggedValue<Actions, "remove">, number>>;
type _4c = Expect<Equal<TaggedValue<Actions, "reset">, null>>;
type _4d = Expect<Equal<TaggedValue<Actions, "unknown">, never>>;

import { describe, it } from "vitest";
describe("type-level koan", () => {
  it.todo("solve via: pnpm typecheck");
});
