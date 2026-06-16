// ─── k-034: Type-Level String Manipulation ───────────────────────────────────
//
// With template literal types + infer + recursion, you can implement string
// operations at the type level. Each operation works on string literal types,
// not at runtime — the "function" is a conditional type that recursively
// processes the string character by character or segment by segment.
//
// Pattern for recursive string types:
//
//   type Op<S extends string> =
//     S extends `${infer First}${infer Rest}`   // peel off first char
//       ? /* process First */ + Op<Rest>          // recurse on Rest
//       : ""                                       // base case: empty string
//
// This is the synthesis koan for Phases 5–8 (template literals + recursion).
// ─────────────────────────────────────────────────────────────────────────────

import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: Repeat — repeat a string N times ─────────────────────────────────
//
// Use the accumulator tuple pattern to count up to N.

type Repeat<
  S extends string,
  N extends number,
  Acc extends string[] = [],
  Curr extends string = "",
> = Acc["length"] extends N ? Curr : Repeat<S, N, [any, ...Acc], `${Curr}${S}`>;

type _1a = Expect<Equal<Repeat<"ab", 3>, "ababab">>;
type _1b = Expect<Equal<Repeat<"x", 0>, "">>;
type _1c = Expect<Equal<Repeat<"hi", 1>, "hi">>;

// ── Part 2: Join — join a tuple of strings with a separator ──────────────────

type Join<T extends string[], Sep extends string> = T extends [
  infer First extends string,
  ...infer Rest extends string[],
]
  ? Rest extends []
    ? First
    : `${First}${Sep}${Join<Rest, Sep>}`
  : "";

type _2a = Expect<Equal<Join<["a", "b", "c"], ".">, "a.b.c">>;
type _2b = Expect<Equal<Join<["x", "y"], "-">, "x-y">>;
type _2c = Expect<Equal<Join<["only"], ",">, "only">>;
type _2d = Expect<Equal<Join<[], ",">, "">>;

// ── Part 3: Replace — replace first occurrence of a substring ─────────────────
//
// `Replace<S, From, To>` replaces the first occurrence of From in S with To.

type Replace<
  S extends string,
  From extends string,
  To extends string,
> = S extends `${infer Start}${From}${infer End}` ? `${Start}${To}${End}` : S;

type _3a = Expect<
  Equal<Replace<"hello world", "world", "TypeScript">, "hello TypeScript">
>;
type _3b = Expect<Equal<Replace<"aabbcc", "b", "x">, "aaxbcc">>; // first only
type _3c = Expect<Equal<Replace<"hello", "xyz", "abc">, "hello">>; // no match

// ── Part 4: ReplaceAll — replace all occurrences ──────────────────────────────

type ReplaceAll<
  S extends string,
  From extends string,
  To extends string,
> = S extends `${infer Start}${From}${infer End}`
  ? `${Start}${To}${ReplaceAll<End, From, To>}`
  : S;

type _4a = Expect<Equal<ReplaceAll<"aabbcc", "b", "x">, "aaxxcc">>;
type _4b = Expect<
  Equal<ReplaceAll<"hello world world", "world", "TS">, "hello TS TS">
>;
type _4c = Expect<Equal<ReplaceAll<"abc", "x", "y">, "abc">>;

// ── Part 5: CountChars — count occurrences of a character ─────────────────────
//
// `CountChars<S, C>` returns the count as a number literal.
// Use the accumulator pattern.

type CountChars<
  S extends string,
  C extends string,
  Acc extends 1[] = [],
> = C extends ""
  ? 0
  : S extends `${string}${C}${infer End}`
    ? CountChars<End, C, [1, ...Acc]>
    : Acc["length"];

type _5a = Expect<Equal<CountChars<"hello", "l">, 2>>;
type _5b = Expect<Equal<CountChars<"aaa", "a">, 3>>;
type _5c = Expect<Equal<CountChars<"xyz", "q">, 0>>;

// ── Part 6: Reverse a string literal ─────────────────────────────────────────

type ReverseString<S extends string, Acc extends string = ""> = S extends ""
  ? Acc
  : S extends `${infer First}${infer Rest}`
    ? ReverseString<Rest, `${First}${Acc}`>
    : never;

type _6a = Expect<Equal<ReverseString<"hello">, "olleh">>;
type _6b = Expect<Equal<ReverseString<"abc">, "cba">>;
type _6c = Expect<Equal<ReverseString<"">, "">>;

import { describe, it } from "vitest";
describe("type-level koan", () => {
  it.todo("solve via: pnpm typecheck");
});
