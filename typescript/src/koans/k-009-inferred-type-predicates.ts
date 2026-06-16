// ─── k-009: Inferred Type Predicates (TypeScript 5.5) ────────────────────────
//
// Before TS 5.5, you had to explicitly write `x is T` on predicate functions.
// TypeScript 5.5 can *infer* the type predicate from the function body when:
//   - The function returns a boolean
//   - The return expression performs a type narrowing check
//
//   function isString(x: unknown) {
//     return typeof x === "string"  // TS 5.5 infers: x is string
//   }
//
// The practical payoff is with `.filter()`. Prior to 5.5, filtering out nulls
// required an explicit predicate annotation:
//
//   const nonNull = arr.filter((x): x is string => x !== null)  // old
//   const nonNull = arr.filter(x => x !== null)                 // TS 5.5 ✓
//
// The array type is narrowed automatically by the filter callback.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import type { Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: Inferred predicate via typeof ─────────────────────────────────────
//
// In TS 5.5, `isString` below has an inferred return type of `x is string`.
// No annotation needed. Verify by checking what filter returns.

function isString(x: unknown) {
  return typeof x === "string";
}

const _mixed1 = [1, "hello", null, "world", 42, undefined];
const _strings = _mixed1.filter(isString);
type _1a = Expect<Equal<typeof _strings, string[]>>;

describe("isString", () => {
  it("filters strings from a mixed array", () => {
    expect([1, "a", null, "b"].filter(isString)).toEqual(["a", "b"]);
  });
});

// ── Part 2: Inferred predicate via != null ────────────────────────────────────
//
// The != null check (which catches both null and undefined) is inferred
// as a type predicate in TS 5.5.

const _mixed2 = ["a", null, "b", undefined, "c"];
const _nonNull = _mixed2.filter((x) => x != null);
type _2a = Expect<Equal<typeof _nonNull, string[]>>;

describe("nonNull filter", () => {
  it("removes null and undefined", () => {
    expect(["a", null, "b", undefined].filter((x) => x != null)).toEqual([
      "a",
      "b",
    ]);
  });
});

// ── Part 3: Inferred predicate with instanceof ────────────────────────────────

const _errors = [new Error("a"), "not an error", new TypeError("b"), 42];
const _errorObjects = _errors.filter((x) => x instanceof Error);
type _3a = Expect<Equal<typeof _errorObjects, Error[]>>;

describe("instanceof filter", () => {
  it("filters Error instances", () => {
    const result = [new Error("a"), "not", new TypeError("b"), 42].filter(
      (x) => x instanceof Error,
    );
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(Error);
  });
});

// ── Part 4: Inferred predicate with in operator ────────────────────────────────

type Cat = { meow: () => void; name: string };
type Dog = { bark: () => void; name: string };
type Pet = Cat | Dog;

const _pets: Pet[] = [
  { meow: () => {}, name: "Whiskers" },
  { bark: () => {}, name: "Rex" },
  { meow: () => {}, name: "Luna" },
];

const _cats = _pets.filter((p) => "meow" in p);
type _4a = Expect<Equal<typeof _cats, Cat[]>>;

describe("in-based predicate", () => {
  it("filters cats using 'meow' in p", () => {
    const result = _pets.filter((p) => "meow" in p);
    expect(result).toHaveLength(2);
    expect(result.every((p) => "meow" in p)).toBe(true);
  });
});

// ── Part 5: When inference does NOT kick in ────────────────────────────────────
//
// TS 5.5 can't infer a predicate when the function has multiple returns,
// complex boolean logic, or side effects. In those cases, you still need
// an explicit `x is T` annotation (as in k-007).
//
// Write `isValidUser` — complex enough that TS 5.5 can't infer it,
// requiring an explicit predicate annotation.

type ValidUser = { id: string; name: string; email: string };

// This function is intentionally complex — write it with an explicit annotation.
function isValidUser(x: unknown): x is ValidUser {
  return !!x && typeof x === "object" && "id" in x && typeof x.id === "string";
}

describe("isValidUser", () => {
  it("validates a complete user object", () => {
    expect(isValidUser({ id: "1", name: "Alice", email: "a@b.com" })).toBe(
      true,
    );
    expect(isValidUser({ id: 1, name: "Alice", email: "a@b.com" })).toBe(false);
    expect(isValidUser(null)).toBe(false);
  });
});
