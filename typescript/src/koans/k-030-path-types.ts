// ─── k-030: Path Types ────────────────────────────────────────────────────────
//
// A common need in form libraries (Formik, React Hook Form), ORMs, and state
// management is to reference a nested value by its dot-notation path as a string.
// The challenge: make the path itself type-safe.
//
//   type User = { profile: { address: { city: string } } }
//   type UserPath = Paths<User>  // "profile" | "profile.address" | "profile.address.city"
//
//   function get<T, P extends Paths<T>>(obj: T, path: P): ValueAtPath<T, P>
//
// This enforces that only valid paths are used and infers the correct return type.
//
// Implementation pattern for Paths:
//   - For each key K in T
//   - K is always a valid path
//   - If T[K] is itself an object, `${K}.${Paths<T[K]>}` is also valid
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import type { TODO, Expect, Equal } from "../utils/type-utils.js";

type Primitive = string | number | boolean | null | undefined | symbol | bigint;

// ── Part 1: Paths<T> — all dot-notation paths ─────────────────────────────────

type Paths<T> = T extends object
  ? T[keyof T] extends object
    ? `${keyof T & string}` | `${keyof T & string}.${Paths<T[keyof T]>}`
    : `${keyof T & string}`
  : never;

type _1a = Expect<Equal<Paths<{ a: string }>, "a">>;
type _1b = Expect<Equal<Paths<{ a: string; b: number }>, "a" | "b">>;
type _1c = Expect<Equal<Paths<{ a: { b: string } }>, "a" | "a.b">>;
type _1d = Expect<
  Equal<Paths<{ a: { b: { c: boolean } } }>, "a" | "a.b" | "a.b.c">
>;

// ── Part 2: ValueAtPath<T, P> — the type at a path ────────────────────────────

type ValueAtPath<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? ValueAtPath<T[K], Rest>
    : T
  : P extends keyof T
    ? T[P]
    : never;

type User = {
  id: string;
  profile: {
    name: string;
    address: {
      city: string;
      zip: string;
    };
  };
};

type _2a = Expect<Equal<ValueAtPath<User, "id">, string>>;
type _2b = Expect<Equal<ValueAtPath<User, "profile">, User["profile"]>>;
type _2c = Expect<Equal<ValueAtPath<User, "profile.name">, string>>;
type _2d = Expect<Equal<ValueAtPath<User, "profile.address.city">, string>>;

// ── Part 3: LeafPaths — only paths that end at a primitive ────────────────────
//
// `LeafPaths<T>` returns only paths whose value is a primitive (not an object).
//

type LeafPaths<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends Primitive | readonly unknown[]
        ? K
        : `${K}.${LeafPaths<T[K]> & string}`;
    }[keyof T & string]
  : never;

type _3a = Expect<
  Equal<LeafPaths<{ a: string; b: { c: number } }>, "a" | "b.c">
>;

type _3b = Expect<
  Equal<
    LeafPaths<User>,
    "id" | "profile.name" | "profile.address.city" | "profile.address.zip"
  >
>;

// ── Part 4: Runtime — type-safe get function ──────────────────────────────────

function get<T, P extends string & Paths<T>>(
  obj: T,
  path: P,
): ValueAtPath<T, P> {
  return path.split(".").reduce((curr: any, key) => curr?.[key], obj) as any;
}

const _user: User = {
  id: "123",
  profile: {
    name: "Alice",
    address: { city: "Portland", zip: "97201" },
  },
};

const _city = get(_user, "profile.address.city");
type _4a = Expect<Equal<typeof _city, string>>;

describe("get", () => {
  it("retrieves nested value by dot path", () => {
    expect(get(_user, "id")).toBe("123");
    expect(get(_user, "profile.name")).toBe("Alice");
    expect(get(_user, "profile.address.city")).toBe("Portland");
  });
});
