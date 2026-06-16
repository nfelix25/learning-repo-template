// ─── k-001: Generic Constraints ──────────────────────────────────────────────
//
// TypeScript generics become precise only when combined with constraints.
// Without them, a type parameter T is essentially `unknown` — you can't
// access properties or call methods on it. The `extends` keyword narrows
// T to a specific shape:
//
//   function get<T extends object, K extends keyof T>(obj: T, key: K): T[K]
//
// `K extends keyof T` constrains K to any key of whatever T is.
// `T[K]` is an indexed access type — the value type of T at key K.
//
// Your task: replace the `any` annotations with proper generic signatures.
// The type assertions and runtime tests both verify your work.
//
// Run:  pnpm typecheck  ← type assertions (fail until solved)
//       pnpm test       ← runtime tests   (pass throughout)
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import type { Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: keyof and indexed access ─────────────────────────────────────────
//
// `pluck` takes an object and one of its keys, and returns the value.
// The return type must be inferred as T[K], not `any` or `unknown`.
//
// Hint: you need two type parameters — one for the object, one for the key.

function pluck<T extends object, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

const _p1result = pluck({ name: "Alice", age: 30 }, "name");
const _p2result = pluck({ x: 10, y: 20 }, "y");
type _1a = Expect<Equal<typeof _p1result, string>>;
type _1b = Expect<Equal<typeof _p2result, number>>;

describe("pluck", () => {
    it("returns the value at a key", () => {
        expect(pluck({ name: "Alice" }, "name")).toBe("Alice");
    });
    it("works with multiple property types", () => {
        expect(pluck({ x: 10, y: 20 }, "y")).toBe(20);
    });
});

// ── Part 2: Constraining to a structural shape ────────────────────────────────
//
// `getLength` should accept anything with a numeric `length` property —
// strings, arrays, typed arrays. Not plain objects like `{ a: 1 }`.
//
// Hint: `{ length: number }` is a valid constraint.

function getLength<V extends { length: number }>(value: V) {
    return value.length;
}

const _g1result = getLength("hello");
const _g2result = getLength([1, 2, 3]);
type _2a = Expect<Equal<typeof _g1result, number>>;

describe("getLength", () => {
    it("returns length of a string", () => {
        expect(getLength("hello")).toBe(5);
    });
    it("returns length of an array", () => {
        expect(getLength([1, 2, 3])).toBe(3);
    });
});

// ── Part 3: Multiple type parameters ─────────────────────────────────────────
//
// `merge` combines two objects. The return type must be their intersection
// `A & B`, not a generic `object`. Both parameters are independently typed.

function merge<A extends object, B extends object>(a: A, b: B) {
    return { ...a, ...b };
}

const _mresult = merge({ a: "hello" }, { b: 42 });
type _3a = Expect<Equal<typeof _mresult, { a: string } & { b: number }>>;

describe("merge", () => {
    it("combines two objects", () => {
        expect(merge({ a: "hello" }, { b: 42 })).toEqual({ a: "hello", b: 42 });
    });
    it("later keys override earlier ones", () => {
        expect(merge({ x: 1 }, { x: 2 })).toEqual({ x: 2 });
    });
});

// ── Part 4: Constraining K to the union of T's keys ──────────────────────────
//
// `pick` returns a new object containing only the requested keys.
// The return type must be `Pick<T, K>`, not `Partial<T>` or `object`.
//
// Hint: K must extend `keyof T`, and the return type uses that relationship.

function pick<T extends object, K extends keyof T>(
    obj: T,
    keys: K[],
): Pick<T, K> {
    const result = {} as Pick<T, K>;
    for (const k of keys) result[k] = obj[k];
    return result;
}

const _pickResult = pick({ a: 1, b: "two", c: true }, ["a", "b"] as const);
type _4a = Expect<
    Equal<
        typeof _pickResult,
        Pick<{ a: number; b: string; c: boolean }, "a" | "b">
    >
>;

describe("pick", () => {
    it("returns only the specified keys", () => {
        expect(pick({ a: 1, b: 2, c: 3 }, ["a", "c"])).toEqual({ a: 1, c: 3 });
    });
    it("does not include unspecified keys", () => {
        const result = pick({ x: "hello", y: "world" }, ["x"]);
        expect(Object.keys(result)).toEqual(["x"]);
    });
});
