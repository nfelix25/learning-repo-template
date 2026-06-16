// ─── k-026: Variadic Tuple Patterns for Function Types ───────────────────────
//
// Variadic tuples were introduced specifically to type higher-order functions
// that manipulate argument lists. The key insight: function parameters are tuples,
// and you can spread them like tuples.
//
//   type Params = Parameters<(a: string, b: number) => void>
//   // → [a: string, b: number]
//
//   type WithLogger<F extends (...args: any[]) => any> =
//     (...args: [...Parameters<F>, logger: Logger]) => ReturnType<F>
//
// This lets you build typed wrappers, partial application, currying, and
// function composition — without losing the original parameter types.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: DropFirst — remove the first parameter ────────────────────────────
//
// `DropFirst<F>` returns a function type with the first parameter removed.
// Used to implement partial application where the first arg is pre-supplied.

type DropFirst<F extends (...args: any[]) => any> = F extends (
  ...args: [infer First, ...infer Args]
) => infer R
  ? (...args: Args) => R
  : never;

type _1a = Expect<
  Equal<
    DropFirst<(a: string, b: number, c: boolean) => void>,
    (b: number, c: boolean) => void
  >
>;
type _1b = Expect<Equal<DropFirst<(x: string) => string>, () => string>>;

// ── Part 2: WithLogger — append a logger parameter ───────────────────────────
//
// `WithLogger<F>` adds a `logger: (msg: string) => void` as the last parameter.

type Logger = (msg: string) => void;
type WithLogger<F extends (...args: any[]) => any> = F extends (
  ...args: infer Args
) => infer R
  ? (...args: [...Args, logger: Logger]) => R
  : never;

type _2a = Expect<
  Equal<
    WithLogger<(name: string) => void>,
    (name: string, logger: Logger) => void
  >
>;

// ── Part 3: Runtime — bind first argument ────────────────────────────────────
//
// `bindFirst` takes a function and a value for its first parameter,
// returning a new function that takes the remaining parameters.

function bindFirst<T, Rest extends any[], R>(
  fn: (first: T, ...rest: Rest) => R,
  value: T,
): (...rest: Rest) => R {
  return (...rest) => fn(value, ...rest);
}

const _add = (a: number, b: number) => a + b;
const _addFive = bindFirst(_add, 5);

type _3a = Expect<Equal<typeof _addFive, (b: number) => number>>;

describe("bindFirst", () => {
  it("binds the first argument", () => {
    expect(bindFirst(_add, 5)(3)).toBe(8);
  });
  it("works with string prefix", () => {
    const prefix = bindFirst((p: string, s: string) => p + s, "Hello, ");
    expect(prefix("World")).toBe("Hello, World");
  });
});

// ── Part 4: Curry type — one argument at a time ────────────────────────────────
//
// A fully curried version of a function: each call takes one argument and returns
// either the result (if no more args needed) or another curried function.
//
// `Curry<F>` is the type of the curried version of F.

type Curry<F extends (...args: any[]) => any> = F extends (
  ...args: [infer First, ...infer Args]
) => infer R
  ? Args extends []
    ? (arg: First) => R
    : (arg: First) => Curry<(...args: Args) => R>
  : never;

type _4a = Expect<Equal<Curry<(a: number) => string>, (a: number) => string>>;

type _4b = Expect<
  Equal<
    Curry<(a: number, b: string) => boolean>,
    (a: number) => (b: string) => boolean
  >
>;

type _4c = Expect<
  Equal<
    Curry<(a: number, b: string, c: boolean) => Date>,
    (a: number) => (b: string) => (c: boolean) => Date
  >
>;

// ── Part 5: OverloadUnion — extract union of all overloads ────────────────────
//
// Functions can have multiple overloads. `Parameters` only captures the last.
// This is a known TypeScript limitation — there's no clean general solution.
//
// For this exercise: given a function with 2 known overloads, extract the
// *first* overload's parameter types using infer chaining.

type FirstOverloadParams<F> = F extends {
  (...args: infer A): string;
  (...args: infer B): number;
}
  ? A
  : never;

interface StringOrNumber {
  (x: string): string;
  (x: number): number;
}

// TypeScript gives us the last overload with Parameters<F>.
// This assertion confirms the known limitation:
type _5a = Expect<Equal<Parameters<StringOrNumber>, [x: number]>>; // last overload

// TODO: implement FirstOverloadParams to get the first overload instead
type _5b = Expect<Equal<FirstOverloadParams<StringOrNumber>, [x: string]>>;
