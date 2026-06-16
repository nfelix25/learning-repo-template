// ─── k-037: Covariance and Contravariance ────────────────────────────────────
//
// Variance describes how subtype relationships on T affect subtype relationships
// on Container<T>.
//
// COVARIANT (return types, readonly properties):
//   If string extends string | number, then:
//   () => string  extends  () => string | number
//   (You can use a "more specific" function where a "more general" is expected.)
//
// CONTRAVARIANT (parameter types):
//   If string extends string | number, then:
//   (x: string | number) => void  extends  (x: string) => void
//   (A function that handles MORE is safer where LESS is expected.)
//   — reversed from what you might expect!
//
// Intuition: a function that handles any vehicle is safe to use
// where a function that handles only cars is expected.
// But a function that only handles cars is NOT safe where any vehicle might appear.
//
// TypeScript enforces this with `strictFunctionTypes` (enabled by strict mode).
// Exception: METHOD syntax (not arrow/function) is checked bivariantly for
// historical compatibility with Array methods.
// ─────────────────────────────────────────────────────────────────────────────

import type { Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: Covariance — return types ─────────────────────────────────────────
//
// These type assertions verify covariance in return positions.
// A function with a narrower return type is assignable to one with a wider return type.

type GetString = () => string;
type GetStringOrNumber = () => string | number;

type _1a = Expect<
  Equal<GetString extends GetStringOrNumber ? true : false, true>
>;
type _1b = Expect<
  Equal<GetStringOrNumber extends GetString ? true : false, false>
>;

// ── Part 2: Contravariance — parameter types ──────────────────────────────────
//
// A function that ACCEPTS a wider type is assignable to one that accepts a narrower type.
// This is reversed: (x: string | number) => void  extends  (x: string) => void

type HandleString = (x: string) => void;
type HandleStringOrNumber = (x: string | number) => void;

type _2a = Expect<
  Equal<HandleStringOrNumber extends HandleString ? true : false, true>
>;
type _2b = Expect<
  Equal<HandleString extends HandleStringOrNumber ? true : false, false>
>;

// ── Part 3: Practical implication — callback assignment ───────────────────────
//
// `processStrings` expects a callback that can handle strings.
// `logAnything` handles any unknown. Is it safe to pass to processStrings?
// `logStringsOnly` only handles strings specifically. Is it safe?

function processStrings(
  items: string[],
  callback: (item: string) => void,
): void {
  items.forEach(callback);
}

const logAnything = (x: unknown) => /* console.log(x); */ {};
const logStringsOnly = (x: string) => /* console.log(x.toUpperCase()); */ {};

// Both should compile — verify your understanding:
processStrings(["a", "b"], logAnything); // logAnything handles string (and more)
processStrings(["a", "b"], logStringsOnly); // logStringsOnly handles exactly string

// ── Part 4: Method bivariance vs function type strictness ─────────────────────
//
// Method syntax (obj.method) is checked bivariantly (unsound, for compatibility).
// Function property syntax ((method: ...) => ...) is checked strictly.

interface BivariantMethod {
  method(x: string): void;
}

interface StrictFunction {
  method: (x: string) => void;
}

// Due to bivariance, this unsound assignment compiles with method syntax:
type _4a = Expect<
  Equal<
    { method(x: string | number): void } extends BivariantMethod ? true : false,
    true // bivariant: both directions allowed
  >
>;

// With function property syntax, only contravariant direction is allowed:
type _4b = Expect<
  Equal<
    { method: (x: string | number) => void } extends StrictFunction
      ? true
      : false,
    true // contravariant: accepts more = safe
  >
>;

type _4c = Expect<
  Equal<
    { method: (x: string) => void } extends {
      method: (x: string | number) => void;
    }
      ? true
      : false,
    false // NOT safe: only accepts less
  >
>;

// ── Part 5: ReadonlyArray — covariant, Array — invariant ─────────────────────
//
// ReadonlyArray<string> extends ReadonlyArray<string | number> (covariant: read-only)
// Array<string> does NOT safely extend Array<string | number> (invariant: mutable)

type _5a = Expect<
  Equal<
    ReadonlyArray<string> extends ReadonlyArray<string | number> ? true : false,
    true
  >
>;

// Note: TypeScript allows mutable array assignment (unsound for compatibility).
// The comment explains WHY it's logically unsound even though TS allows it:
// If arr: Array<string | number>, you could push a number.
// But if it was secretly Array<string> underneath, now it has a number. Oops.

type _note = Expect<
  Equal<Array<string> extends Array<string | number> ? true : false, true>
>;

import { describe, it } from "vitest";
describe("type-level koan", () => {
  it.todo("solve via: pnpm typecheck");
});
