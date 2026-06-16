// ─── k-006: Discriminated Unions ─────────────────────────────────────────────
//
// A discriminated union is a union where each member has a common property
// with a unique literal type. TypeScript uses that property to narrow:
//
//   type Shape =
//     | { kind: "circle";    radius: number }
//     | { kind: "rectangle"; width: number; height: number }
//
//   if (shape.kind === "circle") { shape.radius ... }  // narrowed
//
// The power is in exhaustiveness checking. If you handle all current members
// and add a new one later, TypeScript will point to every switch that needs updating.
//
// Exhaustiveness pattern: a `default` branch that assigns to `never`.
// If it's reachable, TypeScript errors because you can't assign X to never.
//
//   default: {
//     const _exhaustive: never = shape  // error if shape has unhandled cases
//     throw new Error("Unhandled case")
//   }
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import type { Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: Basic discriminated union switch ──────────────────────────────────

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle": {
      return Math.PI * shape.radius ** 2;
    }
    case "rectangle": {
      return shape.width * shape.height;
    }
    case "triangle": {
      return (shape.base / 2) * shape.height;
    }
    default: {
      const _exhaustive: never = shape; // error if shape has unhandled cases
      throw new Error("Unhandled shape");
    }
  }
}

describe("area", () => {
  it("computes circle area", () => {
    expect(area({ kind: "circle", radius: 5 })).toBeCloseTo(78.54, 1);
  });
  it("computes rectangle area", () => {
    expect(area({ kind: "rectangle", width: 4, height: 6 })).toBe(24);
  });
  it("computes triangle area", () => {
    expect(area({ kind: "triangle", base: 8, height: 5 })).toBe(20);
  });
});

// ── Part 2: Exhaustiveness via never ─────────────────────────────────────────
//
// `describeShape` must be exhaustive. Add an `assertNever` helper and use it
// in the default branch. If a future engineer adds a new Shape variant, the
// compiler will error here until they handle it.

function assertNever(x: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(x)}`);
}

function describeShape(shape: Shape): string {
  switch (shape.kind) {
    case "circle":
      return "circle";
    case "rectangle":
      return "rectangle";
    case "triangle":
      return "triangle";
    default:
      assertNever(shape);
  }
}

describe("describeShape", () => {
  it("describes a circle", () => {
    expect(describeShape({ kind: "circle", radius: 3 })).toContain("circle");
  });
  it("describes a rectangle", () => {
    expect(describeShape({ kind: "rectangle", width: 4, height: 5 })).toContain(
      "rectangle",
    );
  });
  it("describes a triangle", () => {
    expect(describeShape({ kind: "triangle", base: 6, height: 4 })).toContain(
      "triangle",
    );
  });
});

// ── Part 3: Result type — the functional Either pattern ──────────────────────
//
// A common discriminated union is a Result type, representing success or failure.
// `Result<T, E>` is either `Ok<T>` or `Err<E>`.

type Ok<T> = { ok: true; value: T };
type Err<E> = { ok: false; error: E };
type Result<T, E = string> = Ok<T> | Err<E>;

function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}
function err<E>(error: E): Err<E> {
  return { ok: false, error };
}

// `divide` returns a Result — Ok with the quotient, or Err if dividing by zero.
function divide(a: number, b: number): Result<number> {
  if (!b) return { ok: false, error: "Divide by Zero" };
  else return { ok: true, value: a / b };
}

// `mapResult` applies a function to the Ok value, passing through Err unchanged.
function mapResult<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> {
  if (result.ok) return { ...result, value: fn(result.value) };
  else return { ...result };
}

describe("Result type", () => {
  it("returns Ok for valid division", () => {
    const result = divide(10, 2);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(5);
  });
  it("returns Err for division by zero", () => {
    const result = divide(10, 0);
    expect(result.ok).toBe(false);
  });
  it("mapResult transforms Ok value", () => {
    const result = mapResult(ok(5), (x) => x * 2);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(10);
  });
  it("mapResult passes through Err", () => {
    const result = mapResult(err("bad"), (x: number) => x * 2);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("bad");
  });
});

type _3a = Expect<Equal<ReturnType<typeof divide>, Result<number>>>;
type _3b = Expect<
  Equal<
    ReturnType<typeof mapResult<number, string, string>>,
    Result<string, string>
  >
>;

// ── Part 4: Narrowing with the satisfies operator ─────────────────────────────
//
// `satisfies` (introduced in 4.9) validates a value against a type without
// widening it. Use it to validate a config object while preserving literal types.

type Config = {
  mode: "development" | "production" | "test";
  port: number;
  debug: boolean;
};

// TODO: use `satisfies Config` so the literal type of `mode` is preserved.
// Without satisfies, `config.mode` would be typed as the wide union.
// With it, TypeScript infers the actual literal "development".
const appConfig = {
  mode: "development",
  port: 3000,
  debug: true,
} satisfies Config;

type _4a = Expect<Equal<typeof appConfig.mode, "development">>;
