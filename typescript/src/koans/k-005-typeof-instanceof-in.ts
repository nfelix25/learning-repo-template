// ─── k-005: typeof, instanceof, and in Narrowing ─────────────────────────────
//
// TypeScript's control flow analysis narrows types within conditional branches.
// Three primitive guards exist at the language level:
//
//   typeof x === "string"   → narrows x to string
//   x instanceof Date       → narrows x to Date
//   "key" in x              → narrows x to types that have "key"
//
// Edge cases matter:
//   typeof null === "object"  — true at runtime, NOT `null`
//   typeof NaN === "number"   — true; isNaN check is separate
//
// After a type guard in an `if` branch, TypeScript narrows the type in that
// branch *and* narrows the opposite type in the `else` branch.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, expectTypeOf } from "vitest";
import type { Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: typeof — all cases including null trap ────────────────────────────
//
// `describe` takes an unknown value and returns a string description of its type.
// Handle: string, number, boolean, null, undefined, arrays, other objects.
// Watch out: typeof null === "object" and typeof [] === "object".

function describeType(value: unknown): string {
  return value === null
    ? "null"
    : Array.isArray(value)
      ? "array"
      : typeof value;
}

describe("describeType", () => {
  it("identifies primitives", () => {
    expect(describeType("hello")).toBe("string");
    expect(describeType(42)).toBe("number");
    expect(describeType(true)).toBe("boolean");
  });
  it("identifies null despite typeof null === 'object'", () => {
    expect(describeType(null)).toBe("null");
  });
  it("identifies undefined", () => {
    expect(describeType(undefined)).toBe("undefined");
  });
  it("identifies arrays before generic objects", () => {
    expect(describeType([1, 2, 3])).toBe("array");
    expect(describeType({ a: 1 })).toBe("object");
  });
});

// ── Part 2: instanceof — narrowing in a class hierarchy ──────────────────────
//
// `formatError` receives a value from a catch block (unknown in TS6 strict mode)
// and returns a user-friendly string.
// Handle: Error, TypeError (extends Error), and fallback.

class AppError extends Error {
  constructor(
    public code: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

function formatError(err: unknown): string {
  return err instanceof AppError
    ? `${err.name} ${err.code}: ${err.message}`
    : err instanceof TypeError
      ? `${err.name}`
      : err instanceof Error
        ? `Error: ${err.message}`
        : `unknown error: ${err}`;
}

describe("formatError", () => {
  it("formats AppError with code", () => {
    expect(formatError(new AppError(404, "Not found"))).toBe(
      "AppError 404: Not found",
    );
  });
  it("formats generic Error", () => {
    expect(formatError(new Error("Something went wrong"))).toBe(
      "Error: Something went wrong",
    );
  });
  it("formats TypeError specifically", () => {
    expect(formatError(new TypeError("Bad type"))).toContain("TypeError");
  });
  it("handles non-Error values", () => {
    expect(formatError("a plain string")).toBe("unknown error: a plain string");
    expect(formatError(42)).toBe("unknown error: 42");
  });
});

// ── Part 3: in — narrowing by property presence ────────────────────────────
//
// A response can be a success or an error shape.
// `getPayload` should extract the payload, narrowing by which key is present.

type ApiSuccess = { data: string; status: "ok" };
type ApiError = { error: string; status: "error" };
type ApiResponse = ApiSuccess | ApiError;

function getPayload(response: ApiResponse): string {
  switch (response.status) {
    case "ok": {
      return response.data;
    }
    case "error": {
      return response.error;
    }
    default:
      return {} as never;
  }
}

const _success: ApiSuccess = { data: "hello", status: "ok" };
const _error: ApiError = { error: "bad request", status: "error" };

type _3a = Expect<Equal<ReturnType<typeof getPayload>, string>>;

describe("getPayload", () => {
  it("returns data from a success response", () => {
    expect(getPayload({ data: "hello", status: "ok" })).toBe("hello");
  });
  it("returns error message from an error response", () => {
    expect(getPayload({ error: "Not found", status: "error" })).toBe(
      "Not found",
    );
  });
});

// ── Part 4: Narrowing in else branches ────────────────────────────────────────
//
// After a type guard, TypeScript narrows the opposite type in `else`.
// `processInput` handles string | number. In the string branch, use toUpperCase.
// In the else branch, TypeScript should know it's a number — use toFixed(2).

function processInput(input: string | number): string {
  if (typeof input === "string") return input.toLocaleUpperCase();
  else return input.toFixed(2);
}

describe("processInput", () => {
  it("uppercases strings", () => {
    expect(processInput("hello")).toBe("HELLO");
  });
  it("formats numbers to 2 decimal places", () => {
    expect(processInput(3.14159)).toBe("3.14");
    expect(processInput(42)).toBe("42.00");
  });
});
