// ─── k-007: Custom Type Predicates ───────────────────────────────────────────
//
// Built-in guards (typeof, instanceof, in) cover primitives and class instances.
// For custom shapes — plain objects, API responses, domain types — you write
// your own type predicate function:
//
//   function isUser(x: unknown): x is User {
//     return typeof x === "object" && x !== null &&
//            "id" in x && typeof (x as any).id === "string"
//   }
//
// The `x is User` return annotation is the predicate.
// TypeScript trusts this declaration — you are making a contract.
// If your predicate body is wrong, the type system won't catch it at compile
// time; only runtime failures reveal it. The runtime tests here verify the contract.
//
// Predicates can be composed: isAdmin = isUser && user.role === "admin".
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import type { Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: Basic type predicate ─────────────────────────────────────────────

type User = {
  id: string;
  name: string;
  email: string;
};

// `isUser` must narrow `unknown` to `User`. The runtime checks must be thorough
// enough that any object satisfying the checks IS a valid User.
function isUser(x: unknown): x is User {
  if (
    x &&
    typeof x === "object" &&
    "email" in x &&
    "id" in x &&
    typeof x.id === "string"
  ) {
    return true;
  }
  return false;
}

const _raw1: unknown = { id: "1", name: "Alice", email: "alice@example.com" };
const _raw2: unknown = { id: "1", name: "Alice" }; // missing email
const _raw3: unknown = null;

if (isUser(_raw1)) {
  type _1a = Expect<Equal<typeof _raw1, User>>; // narrowed in branch
}

describe("isUser", () => {
  it("returns true for valid users", () => {
    expect(isUser({ id: "1", name: "Alice", email: "alice@example.com" })).toBe(
      true,
    );
  });
  it("returns false for missing fields", () => {
    expect(isUser({ id: "1", name: "Alice" })).toBe(false);
  });
  it("returns false for null and non-objects", () => {
    expect(isUser(null)).toBe(false);
    expect(isUser("alice")).toBe(false);
    expect(isUser(42)).toBe(false);
  });
  it("returns false for objects with wrong field types", () => {
    expect(isUser({ id: 1, name: "Alice", email: "alice@example.com" })).toBe(
      false,
    );
  });
});

// ── Part 2: Composed predicates ───────────────────────────────────────────────

type AdminUser = User & { role: "admin"; permissions: string[] };

function isAdmin(x: unknown): x is AdminUser {
  return !!x && typeof x === "object" && "role" in x && x.role === "admin";
}

describe("isAdmin", () => {
  it("returns true for admin users", () => {
    expect(
      isAdmin({
        id: "1",
        name: "Alice",
        email: "alice@example.com",
        role: "admin",
        permissions: ["read", "write"],
      }),
    ).toBe(true);
  });
  it("returns false for regular users", () => {
    expect(
      isAdmin({
        id: "1",
        name: "Alice",
        email: "alice@example.com",
      }),
    ).toBe(false);
  });
  it("returns false for wrong role", () => {
    expect(
      isAdmin({
        id: "1",
        name: "Alice",
        email: "alice@example.com",
        role: "viewer",
        permissions: [],
      }),
    ).toBe(false);
  });
});

// ── Part 3: Predicate on array elements ───────────────────────────────────────
//
// `filterUsers` takes a mixed array and returns only valid User objects.
// The return type must be `User[]`, not `unknown[]`.

function filterUsers(items: unknown[]): User[] {
  return items.filter(isUser);
}

const _mixed: unknown[] = [
  { id: "1", name: "Alice", email: "a@example.com" },
  "not a user",
  { id: "2", name: "Bob", email: "b@example.com" },
  null,
  { id: "3", name: "Carol" }, // missing email
];

type _3a = Expect<Equal<ReturnType<typeof filterUsers>, User[]>>;

describe("filterUsers", () => {
  it("returns only valid User objects", () => {
    const result = filterUsers(_mixed);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Alice");
    expect(result[1].name).toBe("Bob");
  });
});

// ── Part 4: Generic type predicate ────────────────────────────────────────────
//
// `isNonNull` narrows `T | null | undefined` to `T`.
// It should work for any T — string, object, number, etc.

function isNonNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

const _strings = ["hello", null, "world", undefined, "!"].filter(isNonNull);
type _4a = Expect<Equal<typeof _strings, string[]>>;

describe("isNonNull", () => {
  it("filters null and undefined from arrays", () => {
    expect(["a", null, "b", undefined].filter(isNonNull)).toEqual(["a", "b"]);
  });
  it("returns false for null and undefined", () => {
    expect(isNonNull(null)).toBe(false);
    expect(isNonNull(undefined)).toBe(false);
  });
  it("returns true for all other values", () => {
    expect(isNonNull(0)).toBe(true);
    expect(isNonNull("")).toBe(true);
    expect(isNonNull(false)).toBe(true);
  });
});
