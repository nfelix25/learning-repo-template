// ─── k-021: Intrinsic String Manipulation Types ───────────────────────────────
//
// TypeScript provides four compiler-built-in string types. They cannot be
// implemented in userspace — they're handled specially by the compiler:
//
//   Uppercase<S>    → "hello" → "HELLO"
//   Lowercase<S>    → "HELLO" → "hello"
//   Capitalize<S>   → "hello" → "Hello"     (first char only)
//   Uncapitalize<S> → "Hello" → "hello"     (first char only)
//
// They distribute over string literal unions:
//
//   Uppercase<"hello" | "world"> → "HELLO" | "WORLD"
//
// And combine naturally with template literal types:
//
//   type GetterName<K extends string> = `get${Capitalize<K>}`
//   GetterName<"name"> → "getName"
// ─────────────────────────────────────────────────────────────────────────────

import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: Basic transformations ─────────────────────────────────────────────
//
// Apply the four intrinsics to verify you understand each one.

type _1a = Expect<Equal<Uppercase<"hello">, "HELLO">>;
type _1b = Expect<Equal<Lowercase<"HELLO">, "hello">>;
type _1c = Expect<Equal<Capitalize<"hello">, "Hello">>;
type _1d = Expect<Equal<Capitalize<"hELLO">, "HELLO">>; // ONLY first char affected
type _1e = Expect<Equal<Uncapitalize<"Hello">, "hello">>;

// ── Part 2: Getter and setter name generators ─────────────────────────────────

type GetterName<K extends string> = `get${Capitalize<K>}`;
type SetterName<K extends string> = `set${Capitalize<K>}`;

type _2a = Expect<Equal<GetterName<"name">, "getName">>;
type _2b = Expect<Equal<GetterName<"isActive">, "getIsActive">>;
type _2c = Expect<Equal<SetterName<"count">, "setCount">>;

// ── Part 3: SCREAMING_SNAKE to camelCase ─────────────────────────────────────
//
// Convert SCREAMING_SNAKE_CASE to camelCase using template literals and intrinsics.
// "HELLO_WORLD" → "helloWorld"
//
// Hint: infer the prefix before "_" and the rest after, then recurse.

type ScreamingToCamel<S extends string> =
  S extends `${infer First}_${infer Last}`
    ? `${Lowercase<First>}${Capitalize<ScreamingToCamel<Last>>}`
    : Lowercase<S>;

type _3a = ScreamingToCamel<"HELLO">;
type _3b = Expect<Equal<ScreamingToCamel<"HELLO_WORLD">, "helloWorld">>;
type _3c = Expect<Equal<ScreamingToCamel<"FOO_BAR_BAZ">, "fooBarBaz">>;

// ── Part 4: kebab-case to camelCase ──────────────────────────────────────────
//
// "hello-world" → "helloWorld"
// "foo-bar-baz" → "fooBarBaz"

type KebabToCamel<S extends string> = S extends `${infer First}-${infer Last}`
  ? `${Lowercase<First>}${Capitalize<KebabToCamel<Last>>}`
  : Lowercase<S>;

type _4a = Expect<Equal<KebabToCamel<"hello-world">, "helloWorld">>;
type _4b = Expect<Equal<KebabToCamel<"foo-bar-baz">, "fooBarBaz">>;
type _4c = Expect<Equal<KebabToCamel<"no-dashes">, "noDashes">>;
type _4d = Expect<Equal<KebabToCamel<"single">, "single">>;

// ── Part 5: Object with camelCase keys from kebab-case keys ───────────────────
//
// `CamelizeKeys<T>` maps an object's keys from kebab-case to camelCase.

type CamelizeKeys<T extends Record<string, unknown>> = {
  [K in keyof T as KebabToCamel<K & string>]: T[K];
};

type _5a = Expect<
  Equal<
    CamelizeKeys<{
      "first-name": string;
      "last-name": string;
      "is-active": boolean;
    }>,
    { firstName: string; lastName: string; isActive: boolean }
  >
>;

import { describe, it } from "vitest";
describe("type-level koan", () => {
  it.todo("solve via: pnpm typecheck");
});
