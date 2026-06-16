// ─── k-023: Template Literal Pattern Matching with infer ─────────────────────
//
// Template literal types can appear in the extends clause of a conditional type,
// and `infer` can capture parts of the matched pattern:
//
//   type ExtractPrefix<S, Sep extends string> =
//     S extends `${infer Prefix}${Sep}${string}` ? Prefix : never
//
//   ExtractPrefix<"hello.world", "."> → "hello"
//
// This is the type-level equivalent of a regex match with capture groups.
// Combined with recursion, you can implement type-level string parsing:
// splitting paths, parsing CSS units, decoding URL patterns, and more.
// ─────────────────────────────────────────────────────────────────────────────

import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: ExtractBefore — everything before a separator ─────────────────────

type ExtractBefore<
  S extends string,
  Sep extends string,
> = S extends `${infer T}${Sep}${string}` ? T : never;

type _1a = Expect<Equal<ExtractBefore<"hello.world", ".">, "hello">>;
type _1b = Expect<Equal<ExtractBefore<"user:admin", ":">, "user">>;
type _1c = Expect<Equal<ExtractBefore<"noseparator", ".">, never>>;

// ── Part 2: ExtractAfter — everything after a separator ──────────────────────

type ExtractAfter<
  S extends string,
  Sep extends string,
> = S extends `${string}${Sep}${infer T}` ? T : never;

type _2a = Expect<Equal<ExtractAfter<"hello.world", ".">, "world">>;
type _2b = Expect<Equal<ExtractAfter<"user:admin", ":">, "admin">>;
type _2c = Expect<Equal<ExtractAfter<"noseparator", ".">, never>>;

// ── Part 3: Split — split a string into a tuple ──────────────────────────────
//
// `Split<S, Sep>` splits S by Sep into a tuple of string literal types.
// Recurse by peeling off the first segment, then splitting the remainder.

type Split<
  S extends string,
  Sep extends string,
> = S extends `${infer head}${Sep}${infer tail}`
  ? [head, ...Split<tail, Sep>]
  : [S];

type _3a = Expect<Equal<Split<"a.b.c", ".">, ["a", "b", "c"]>>;
type _3b = Expect<Equal<Split<"x/y/z", "/">, ["x", "y", "z"]>>;
type _3c = Expect<Equal<Split<"hello", ".">, ["hello"]>>;
type _3d = Expect<Equal<Split<"a.b", ".">, ["a", "b"]>>;

// ── Part 4: TrimLeft / TrimRight / Trim ──────────────────────────────────────
//
// Remove leading/trailing whitespace (spaces and tabs) from a string literal.
// Recurse to strip one character at a time.

type TrimLeft<S extends string> = S extends `${" " | "\t"}${infer T}`
  ? TrimLeft<T>
  : S;
type TrimRight<S extends string> = S extends `${infer T}${" "}`
  ? TrimRight<T>
  : S;
type Trim<S extends string> = TrimLeft<TrimRight<S>>;

type _4a = Expect<Equal<TrimLeft<"  hello">, "hello">>;
type _4b = Expect<Equal<TrimLeft<"\thello">, "hello">>;
type _4c = Expect<Equal<TrimRight<"hello  ">, "hello">>;
type _4d = Expect<Equal<Trim<"  hello  ">, "hello">>;
type _4e = Expect<Equal<Trim<"no spaces">, "no spaces">>;

// ── Part 5: ParseQueryString — type-level URL query parser ───────────────────
//
// Parse `"a=1&b=2&c=3"` into `{ a: "1"; b: "2"; c: "3" }`.
// Recurse on `&` to get each pair, then split each pair on `=`.

type AddParam<Acc, K extends string, V extends string> = {
  [P in keyof Acc | K]: P extends K ? V : P extends keyof Acc ? Acc[P] : Acc;
};

type ParseQueryString<
  S extends string,
  Acc = {},
> = S extends `${infer K}=${infer V}&${infer Rest}`
  ? ParseQueryString<Rest, AddParam<Acc, K, V>>
  : S extends `${infer K}=${infer V}`
    ? AddParam<Acc, K, V>
    : Acc;

type _5a = Expect<Equal<ParseQueryString<"a=1">, { a: "1" }>>;
type _5b = Expect<Equal<ParseQueryString<"a=1&b=2">, { a: "1"; b: "2" }>>;
type _5c = Expect<
  Equal<
    ParseQueryString<"x=hello&y=world&z=ts">,
    { x: "hello"; y: "world"; z: "ts" }
  >
>;

import { describe, it } from "vitest";
describe("type-level koan", () => {
  it.todo("solve via: pnpm typecheck");
});
