// ─── k-035: Branded / Nominal Types ──────────────────────────────────────────
//
// TypeScript is structurally typed: two types with the same shape are
// interchangeable, even if they represent different domains:
//
//   type UserId    = string
//   type ProductId = string
//   const fn = (id: UserId) => ...
//   fn("abc" as ProductId)  // no error — both are just string
//
// Branding attaches a unique phantom property to make types nominally distinct:
//
//   type UserId    = string & { __brand: "UserId" }
//   type ProductId = string & { __brand: "ProductId" }
//
// Now UserId and ProductId are structurally different — you can't accidentally
// pass one where the other is expected. The brand only exists at the type level;
// at runtime the value is still a plain string.
//
// Constructor functions validate and stamp the brand:
//   const userId = (s: string): UserId => s as UserId
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import type { Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: Intersection-based brand ─────────────────────────────────────────
//
// Create `UserId` and `ProductId` as branded strings.
// They must NOT be mutually assignable, but must both be assignable to `string`.

declare const __brand: unique symbol;
type Brand<T, B> = T & { __brand: B };

type UserId = Brand<string, "UserId">;
type ProductId = Brand<string, "ProductId">;

function userId(s: string): UserId {
  return s as UserId;
}
function productId(s: string): ProductId {
  return s as ProductId;
}

// These must compile (brands are compatible with their base types):
const _userStr: string = userId("123");
const _prodStr: string = productId("456");

// These must NOT compile — uncomment to verify they error:
// const _bad1: UserId = productId("456")   // should error
// const _bad2: ProductId = userId("123")   // should error

type _1a = Expect<Equal<UserId, Brand<string, "UserId">>>;
type _1b = Expect<Equal<ProductId, Brand<string, "ProductId">>>;

describe("branded types", () => {
  it("branded values are equal to their underlying value at runtime", () => {
    expect(userId("123") === "123").toBe(true);
    expect(productId("456") === "456").toBe(true);
  });
});

// ── Part 2: Validated brand constructor ──────────────────────────────────────
//
// `Email` is a branded string that must pass format validation.
// The constructor returns `Email | null`, not just `Email`, so callers
// are forced to handle the invalid case.

type Email = Brand<string, "Email">;

function isEmail(s: string): s is Email {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function parseEmail(s: string): Email | null {
  return isEmail(s) ? s : null;
}

describe("parseEmail", () => {
  it("returns Email for valid address", () => {
    const result = parseEmail("alice@example.com");
    expect(result).not.toBeNull();
    expect(result).toBe("alice@example.com");
  });
  it("returns null for invalid address", () => {
    expect(parseEmail("not-an-email")).toBeNull();
    expect(parseEmail("@no-local")).toBeNull();
    expect(parseEmail("no-at-sign")).toBeNull();
  });
});

// ── Part 3: Positive integer brand ───────────────────────────────────────────

type PositiveInt = Brand<number, "PositiveInt">;

function positiveInt(n: number): PositiveInt {
  if (!Number.isInteger(n) || n <= 0)
    throw new Error(`Expected positive integer, got ${n}`);
  return n as PositiveInt;
}

describe("positiveInt", () => {
  it("creates a positive integer", () => {
    expect(positiveInt(5) === 5).toBe(true);
  });
  it("throws for non-positive or non-integer", () => {
    expect(() => positiveInt(0)).toThrow();
    expect(() => positiveInt(-1)).toThrow();
    expect(() => positiveInt(1.5)).toThrow();
  });
});

// ── Part 4: Generic brand utility ────────────────────────────────────────────
//
// A reusable `Opaque<T, K>` type and branded value helper.
// `make<T extends Brand<any, any>>(value: ???): T` casts to a brand.
// This is useful when you trust the value is already valid.

type Opaque<T, K extends string> = T & { readonly __opaque: K };

function make<T extends Opaque<any, any>>(
  value: T extends Opaque<infer U, any> ? U : never,
): T {
  return value as T;
}

type MeterId = Opaque<number, "MeterId">;
type SecondId = Opaque<number, "SecondId">;

const _m: MeterId = make<MeterId>(42);
const _s: SecondId = make<SecondId>(10);

type _4a = Expect<Equal<typeof _m, MeterId>>;
type _4b = Expect<Equal<typeof _s, SecondId>>;
