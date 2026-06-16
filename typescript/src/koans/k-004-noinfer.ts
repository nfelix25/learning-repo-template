// ─── k-004: NoInfer<T> (TypeScript 5.4) ──────────────────────────────────────
//
// TypeScript infers a generic type parameter from ALL positions where it appears.
// This can create problems when one argument should *not* drive inference:
//
//   function createState<S>(initial: S, onInvalid: (s: S) => void): S
//   createState(0, s => s.toFixed(2))  // T inferred as 0 | number → 0
//
// If `initial` should set S and `onInvalid` should only be *checked* against S,
// you can wrap the second parameter: `onInvalid: (s: NoInfer<S>) => void`
//
// `NoInfer<T>` tells TypeScript: "use T here for type checking, but don't let
// this site contribute to inferring what T is."
//
// Canonical use case: a default value that should match the inferred type
// but must not be the thing that determines the inferred type.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import type { Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: The problem — unwanted inference widening ─────────────────────────
//
// `withDefault` takes an array and a fallback element. The element type should
// be inferred from the array — not from the fallback.
//
// WITHOUT NoInfer, passing a widened fallback widens the whole array type:
//   withDefault([1, 2, 3], 0 as number)  // infers T as number (correct)
//   withDefault(["a", "b"], "" as string) // infers T as string (widened!)
//
// WITH NoInfer on the fallback, T is always inferred from the array alone.

function withDefault<T>(arr: T[], fallback: T): T {
    return arr.length > 0 ? arr[0] : fallback;
}

const _wd1 = withDefault(["hello", "world"], "");
const _wd2 = withDefault([1, 2, 3], 0);
// T should be inferred as string/number from the array, not widened by fallback
type _1a = Expect<Equal<typeof _wd1, string>>;
type _1b = Expect<Equal<typeof _wd2, number>>;

describe("withDefault", () => {
    it("returns first element when array is non-empty", () => {
        expect(withDefault(["hello", "world"], "")).toBe("hello");
    });
    it("returns fallback when array is empty", () => {
        expect(withDefault([], "default")).toBe("default");
    });
});

// ── Part 2: NoInfer for validated callbacks ────────────────────────────────────
//
// `createMachine` takes a list of valid states and an initial state.
// The initial state should be type-checked against the states array,
// but should NOT widen the inferred state type.
//
//   createMachine(["idle", "loading", "done"], "idle")   // ✓ fine
//   createMachine(["idle", "loading", "done"], "invalid") // should error

function createMachine<const T>(
    states: readonly T[],
    initial: T,
): { state: T; states: readonly T[] } {
    if (!states.includes(initial))
        throw new Error(`Invalid initial state: ${initial}`);
    return { state: initial, states };
}

const _m1 = createMachine(["idle", "loading", "done"] as const, "idle");
type _2a = Expect<
    Equal<
        typeof _m1,
        {
            state: "idle" | "loading" | "done";
            states: readonly ("idle" | "loading" | "done")[];
        }
    >
>;

describe("createMachine", () => {
    it("creates a machine with valid initial state", () => {
        const m = createMachine(["a", "b", "c"], "a");
        expect(m.state).toBe("a");
    });
    it("throws on invalid initial state", () => {
        expect(() => createMachine(["a", "b"], "c")).toThrow();
    });
});

// ── Part 3: NoInfer vs explicit annotation — when to use each ────────────────
//
// Annotating `fallback: T` lets fallback drive inference.
// Annotating `fallback: NoInfer<T>` prevents it.
//
// `prefer` picks the first non-null value from a list of options.
// The list type should determine T; any explicit override should be checked against T
// without widening T to the override's type.

function prefer<T>(options: T[], override: T | null): T {
    return override ?? (options.find((x: T) => x != null) as T);
}

const _pr1 = prefer(["a", "b", "c"], null);
const _pr2 = prefer([1, 2, 3], null);
type _3a = Expect<Equal<typeof _pr1, string>>;
type _3b = Expect<Equal<typeof _pr2, number>>;

describe("prefer", () => {
    it("returns override when not null", () => {
        expect(prefer(["a", "b"], "z")).toBe("z");
    });
    it("returns first non-null option", () => {
        expect(prefer([null, "b", "c"], null)).toBe("b");
    });
});
