// ─── k-008: Assertion Functions ──────────────────────────────────────────────
//
// Type predicates (k-007) return `boolean` — the narrowing only applies inside
// the `if` branch. Assertion functions are different: they throw on failure,
// and TypeScript narrows the type for ALL code after the call:
//
//   function assert(condition: unknown): asserts condition {
//     if (!condition) throw new Error("Assertion failed")
//   }
//
//   function assertIsString(x: unknown): asserts x is string {
//     if (typeof x !== "string") throw new TypeError("Expected string")
//   }
//
//   let x: unknown = getFromAPI()
//   assertIsString(x)
//   x.toUpperCase()  // ✓ — TypeScript knows x is string here
//
// The contract: if the function returns normally (doesn't throw), the assertion
// holds for the rest of the scope. You cannot use an assertion function inside
// an `if` condition — it must be a standalone statement.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import type { Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: asserts condition ────────────────────────────────────────────────
//
// `assert` is the simplest form: throw if the condition is falsy.
// After calling it, TypeScript treats the condition as true.

function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function getUsername(user: { name: string } | null): string {
  assert(user !== null, "user must not be null");
  return user.name; // TypeScript should know user is not null here
}

describe("assert", () => {
  it("does not throw when condition is truthy", () => {
    expect(() => assert(true)).not.toThrow();
    expect(() => assert(1)).not.toThrow();
    expect(() => assert("non-empty")).not.toThrow();
  });
  it("throws when condition is falsy", () => {
    expect(() => assert(false, "condition failed")).toThrow("condition failed");
    expect(() => assert(null)).toThrow();
    expect(() => assert(0)).toThrow();
  });
  it("getUsername returns name after assertion", () => {
    expect(getUsername({ name: "Alice" })).toBe("Alice");
    expect(() => getUsername(null)).toThrow();
  });
});

// ── Part 2: asserts x is T ───────────────────────────────────────────────────
//
// `assertString` narrows x to `string` for all code after the call.
// Note: the narrowing persists even outside `if` branches.

function assertString(x: unknown): asserts x is string {
  return assert(typeof x === "string");
}

describe("assertString", () => {
  it("does not throw for strings", () => {
    expect(() => assertString("hello")).not.toThrow();
  });
  it("throws for non-strings", () => {
    expect(() => assertString(42)).toThrow();
    expect(() => assertString(null)).toThrow();
    expect(() => assertString({})).toThrow();
  });
  it("narrows type after call", () => {
    const x: unknown = "hello";
    assertString(x);
    // After assertion, x is string — this test verifies the runtime part.
    expect(x.toUpperCase()).toBe("HELLO");
  });
});

// ── Part 3: Assertion vs predicate — different narrowing scope ────────────────
//
// `ensureArray` takes an unknown value and asserts it's T[].
// After calling it, the variable is narrowed for the rest of the function.

function ensureArray<T>(value: unknown): asserts value is T[] {
  return assert(Array.isArray(value));
}

function sumNumbers(input: unknown): number {
  ensureArray<number>(input);
  return input.reduce((acc: number, n: number) => acc + n, 0); // input is number[] here
}

describe("ensureArray", () => {
  it("does not throw for arrays", () => {
    expect(() => ensureArray([1, 2, 3])).not.toThrow();
    expect(() => ensureArray([])).not.toThrow();
  });
  it("throws for non-arrays", () => {
    expect(() => ensureArray("not an array")).toThrow();
    expect(() => ensureArray(null)).toThrow();
    expect(() => ensureArray({ length: 3 })).toThrow();
  });
  it("sumNumbers works after assertion", () => {
    expect(sumNumbers([1, 2, 3, 4])).toBe(10);
    expect(() => sumNumbers("not an array")).toThrow();
  });
});

// ── Part 4: Custom assertion with typed error ─────────────────────────────────
//
// `assertDefined` asserts that a value is neither null nor undefined.
// It should work for any T and narrow T | null | undefined → T.

function assertDefined<T>(
  value: T | null | undefined,
  name?: string,
): asserts value is T {
  if (value == null) throw new Error(name);
}

const _maybeUser: { name: string } | null = { name: "Alice" };
assertDefined(_maybeUser, "user");
type _4a = Expect<Equal<typeof _maybeUser, { name: string }>>; // narrowed after assertion

describe("assertDefined", () => {
  it("does not throw for defined values", () => {
    expect(() => assertDefined("hello")).not.toThrow();
    expect(() => assertDefined(0)).not.toThrow();
    expect(() => assertDefined(false)).not.toThrow();
  });
  it("throws for null and undefined", () => {
    expect(() => assertDefined(null, "value")).toThrow("value");
    expect(() => assertDefined(undefined)).toThrow();
  });
});
