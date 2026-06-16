// ─── k-003: const Type Parameters (TypeScript 5.0) ───────────────────────────
//
// When TypeScript infers a type parameter from a value, it "widens" by default:
//
//   function first<T>(arr: T[]): T
//   first(["a", "b", "c"])   // T inferred as `string`, not "a" | "b" | "c"
//
// TypeScript 5.0 introduced `const` type parameters. Adding `const` tells the
// compiler to infer the narrowest possible (literal) type, as if the argument
// had been written with `as const`:
//
//   function first<const T>(arr: readonly T[]): T
//   first(["a", "b", "c"])   // T inferred as "a" | "b" | "c"
//
// This is most useful for functions that operate on specific literal values —
// route definitions, event names, config keys, etc. — where widening to `string`
// throws away information you need.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import type { Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: Widening vs literal inference ────────────────────────────────────
//
// These two functions are intentionally different. Study the types before solving.
//
// `toTuple` should infer each element's literal type, returning a readonly tuple.
// `toTupleWide` should infer the base type, returning a mutable array.

function toTuple<const T>(arr: T): T {
    return arr;
}

function toTupleWide<T>(arr: T[]): T[] {
    return arr;
}

const _t1 = toTuple(["x", "y", "z"]);
const _t2 = toTupleWide(["x", "y", "z"]);
type _1a = Expect<Equal<typeof _t1, readonly ["x", "y", "z"]>>;
type _1b = Expect<Equal<typeof _t2, string[]>>;

describe("toTuple", () => {
    it("returns the same array", () => {
        expect(toTuple(["x", "y", "z"])).toEqual(["x", "y", "z"]);
        expect(toTupleWide(["x", "y", "z"])).toEqual(["x", "y", "z"]);
    });
});

// ── Part 2: Literal inference without as const at the call site ───────────────
//
// `makeRoutes` should infer literal path strings without requiring `as const`
// at the call site. With `const` type parameter, the caller writes naturally:
//
//   const routes = makeRoutes(["/home", "/about", "/users"])
//   // routes should be { "/home": boolean, "/about": boolean, "/users": boolean }
//   // NOT { [x: string]: boolean }
//
type RouteMap<T extends readonly string[]> = {
    [K in T[number]]: boolean;
};

function makeRoutes<const T extends string[]>(paths: T): RouteMap<T> {
    return Object.fromEntries(
        paths.map((p: string) => [p, false]),
    ) as RouteMap<T>;
}

const _routes = makeRoutes(["/home", "/about", "/users"]);
type _2a = Expect<
    Equal<
        typeof _routes,
        { "/home": boolean; "/about": boolean; "/users": boolean }
    >
>;

describe("makeRoutes", () => {
    it("creates a routes object with false values", () => {
        expect(makeRoutes(["/home", "/about"])).toEqual({
            "/home": false,
            "/about": false,
        });
    });
});

// ── Part 3: const with object type parameters ─────────────────────────────────
//
// `config` captures an entire config object and returns it with its exact shape.
// Without `const`, nested string values widen to `string`.

function config<const T extends object>(obj: T): T {
    return obj;
}

const _cfg = config({ env: "production", region: "us-east-1" });
type _3a = Expect<
    Equal<
        typeof _cfg,
        { readonly env: "production"; readonly region: "us-east-1" }
    >
>;

describe("config", () => {
    it("returns the same object", () => {
        const result = config({ env: "production" });
        expect(result.env).toBe("production");
    });
});
