// ─── k-015: Conditional Types — Basics ───────────────────────────────────────
//
// Conditional types follow the ternary form:
//
//   T extends U ? TrueType : FalseType
//
// Read: "If T is assignable to U, the type is TrueType; otherwise FalseType."
// Assignability here is structural: `{a: string}` extends `{a: string | number}`.
//
// Conditional types are most powerful as generics:
//
//   type IsString<T> = T extends string ? "yes" : "no"
//   type A = IsString<string>  // "yes"
//   type B = IsString<number>  // "no"
//
// They can be nested like ternaries in JavaScript:
//
//   type TypeName<T> =
//     T extends string ? "string" :
//     T extends number ? "number" :
//     "other"
//
// Important: when T is `never`, the true branch is never evaluated — you get
// `never` back. `never extends string ? "yes" : "no"` → `never`, not `"no"`.
// ─────────────────────────────────────────────────────────────────────────────

import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: IsArray ───────────────────────────────────────────────────────────

type IsArray<T> = T extends any[] ? true : false;

type _1a = Expect<Equal<IsArray<string[]>, true>>;
type _1b = Expect<Equal<IsArray<string>, false>>;
type _1c = Expect<Equal<IsArray<never>, never>>; // never propagates

// ── Part 2: TypeName — multi-way conditional ─────────────────────────────────
//
// `TypeName<T>` returns a string literal describing T:
// "string" | "number" | "boolean" | "null" | "undefined" | "function" | "object"

type TypeName<T> = T extends string
  ? "string"
  : T extends number
    ? "number"
    : T extends boolean
      ? "boolean"
      : T extends null
        ? "null"
        : T extends undefined
          ? "undefined"
          : T extends () => void
            ? "function"
            : "object";

type _2a = Expect<Equal<TypeName<string>, "string">>;
type _2b = Expect<Equal<TypeName<number>, "number">>;
type _2c = Expect<Equal<TypeName<boolean>, "boolean">>;
type _2d = Expect<Equal<TypeName<null>, "null">>;
type _2e = Expect<Equal<TypeName<undefined>, "undefined">>;
type _2f = Expect<Equal<TypeName<() => void>, "function">>;
type _2g = Expect<Equal<TypeName<{ a: string }>, "object">>;

// ── Part 3: IfElse — conditional type as a control flow primitive ─────────────
//
// `IfElse<Condition, Then, Else>` evaluates to Then if Condition is true, else Else.
// Condition must be exactly `true` or `false`, not a generic boolean.

type IfElse<Condition extends boolean, Then, Else> = Condition extends true
  ? Then
  : Else;

type _3a = Expect<Equal<IfElse<true, string, number>, string>>;
type _3b = Expect<Equal<IfElse<false, string, number>, number>>;

// ── Part 4: Unwrap — conditional to extract inner type ───────────────────────
//
// `Unwrap<T>` extracts the inner type from common wrappers:
// - Promise<T> → T
// - Array<T>   → T
// - T (not wrapped) → T (pass through)
//
// Order matters in nested conditionals — check the most specific first.

type Unwrap<T> =
  T extends Promise<infer U> ? U : T extends Array<infer U> ? U : T;

type _4a = Expect<Equal<Unwrap<Promise<string>>, string>>;
type _4b = Expect<Equal<Unwrap<number[]>, number>>;
type _4c = Expect<Equal<Unwrap<string>, string>>;
type _4d = Expect<Equal<Unwrap<Promise<number[]>>, number[]>>; // one level only

// ── Part 5: IsNever — detect the never type ───────────────────────────────────
//
// You cannot use a plain `T extends never` to detect `never` — because `never`
// distributes and vanishes. Wrapping in a tuple prevents distribution:
//   `[T] extends [never]` correctly returns true when T is never.

type IsNever<T> = [T] extends [never] ? true : false;

type _5a = Expect<Equal<IsNever<never>, true>>;
type _5b = Expect<Equal<IsNever<string>, false>>;
type _5c = Expect<Equal<IsNever<0>, false>>;

import { describe, it } from "vitest";
describe("type-level koan", () => {
  it.todo("solve via: pnpm typecheck");
});
