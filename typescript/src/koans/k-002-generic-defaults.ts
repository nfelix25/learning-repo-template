// ─── k-002: Generic Defaults and Inference ───────────────────────────────────
//
// Type parameters can have default values, just like function parameters:
//
//   type Box<T = string> = { value: T }
//   type StringBox = Box             // same as Box<string>
//   type NumberBox = Box<number>     // overrides the default
//
// TypeScript also *infers* type parameters from how you use the function or type.
// When you write `identity("hello")`, T is inferred as `"hello"` (the literal),
// not `string` (the widened type) — unless you've explicitly widened it.
//
// Understanding when TypeScript infers vs. when you must annotate is key to
// writing generic APIs that "just work" without explicit type arguments.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: Default type parameters ──────────────────────────────────────────
//
// `Container` should hold a value of type T, defaulting to `unknown`.
// When no type argument is given, T should be `unknown`.

type Container<T = unknown> = {
    value: T;
};

type _1a = Expect<Equal<Container, { value: unknown }>>;
type _1b = Expect<Equal<Container<string>, { value: string }>>;
type _1c = Expect<Equal<Container<number[]>, { value: number[] }>>;

// ── Part 2: Inference from arguments ─────────────────────────────────────────
//
// `wrap` returns a Container with the value's type inferred from the argument.
// No explicit type argument should be needed at the call site.

function wrap<V>(value: V): Container<V> {
    return { value };
}

const _w1 = wrap("hello");
const _w2 = wrap(42);
const _w3 = wrap([true, false]);
type _2a = Expect<Equal<typeof _w1, Container<string>>>;
type _2b = Expect<Equal<typeof _w2, Container<number>>>;
type _2c = Expect<Equal<typeof _w3, Container<boolean[]>>>;

describe("wrap", () => {
    it("wraps values in a container", () => {
        expect(wrap("hello")).toEqual({ value: "hello" });
        expect(wrap(42)).toEqual({ value: 42 });
    });
});

// ── Part 3: When inference produces widened vs literal types ──────────────────
//
// TypeScript widens `"hello"` to `string` unless you prevent it.
// Study the difference between these two functions:
//
//   function identity<T>(x: T): T                  // infers literal "hello"
//   function identityWide<T extends string>(x: T): string  // returns string
//
// Implement `identityLiteral` so T is inferred as the literal type, not widened.
// Implement `identityWide` so it always returns the base type `string`.

function identityLiteral<T>(x: T): T {
    return x;
}

function identityWide<T extends string>(x: T): string {
    return x;
}

const _il = identityLiteral("hello");
const _iw = identityWide("hello");
type _3a = Expect<Equal<typeof _il, "hello">>; // must be literal "hello"
type _3b = Expect<Equal<typeof _iw, string>>; // must be widened string

describe("identity variants", () => {
    it("identityLiteral returns the same value", () => {
        expect(identityLiteral("hello")).toBe("hello");
        expect(identityLiteral(42)).toBe(42);
    });
    it("identityWide returns the same value", () => {
        expect(identityWide("hello")).toBe("hello");
    });
});

// ── Part 4: Multiple defaults with dependencies ───────────────────────────────
//
// A type parameter's default can reference earlier type parameters.
// `Pair` holds two values; the second defaults to the same type as the first.
//
//   Pair<string>         ↝  { first: string; second: string }
//   Pair<string, number> ↝  { first: string; second: number }

type Pair<A, B = A> = { first: A; second: B };

type _4a = Expect<Equal<Pair<string>, { first: string; second: string }>>;
type _4b = Expect<
    Equal<Pair<string, number>, { first: string; second: number }>
>;
type _4c = Expect<Equal<Pair<boolean>, { first: boolean; second: boolean }>>;
