// ─── k-045: switch(true) Narrowing (TypeScript 5.3) ──────────────────────────
//
// TypeScript 5.3 improved narrowing inside `switch(true)` statements.
// Each `case` is treated as a type guard, and TypeScript narrows the scrutinee
// based on the truthiness of each case expression.
//
//   switch (true) {
//     case isString(x):  // x is string here
//       break
//     case isNumber(x):  // x is number here
//       break
//   }
//
// This mirrors how you'd use `if/else if` with type guards, but reads well for
// exhaustive "trait checking" scenarios where you want a cleaner visual alignment
// of conditions and their bodies.
//
// It also works with inline boolean expressions, not just predicate functions.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest"

// ── Part 1: Basic switch(true) with type predicates ───────────────────────────
//
// `describe` takes an unknown value and returns a string description.
// Use switch(true) with type-guard cases for clean dispatch.

type Shape = { kind: "circle"; radius: number } | { kind: "rect"; width: number; height: number }

function describeShape(shape: Shape): string {
  switch (true) {
    case shape.kind === "circle":
      return `circle with radius ${shape.radius}`
    case shape.kind === "rect":
      return `rect ${shape.width}×${shape.height}`
    default:
      return "unknown shape"
  }
}

describe("switch(true) shape description", () => {
  it("describes a circle", () => {
    expect(describeShape({ kind: "circle", radius: 5 })).toBe("circle with radius 5")
  })
  it("describes a rect", () => {
    expect(describeShape({ kind: "rect", width: 10, height: 4 })).toBe("rect 10×4")
  })
})

// ── Part 2: Narrowing unknown with inline predicates ─────────────────────────
//
// Use switch(true) to handle an `unknown` value, narrowing at each case.

function processValue(x: unknown): string {
  switch (true) {
    case typeof x === "string":
      return `string: "${x.toUpperCase()}"`
    case typeof x === "number":
      return `number: ${x.toFixed(2)}`
    case Array.isArray(x):
      return `array of ${x.length}`
    case x === null:
      return "null"
    default:
      return "other"
  }
}

describe("processValue switch(true)", () => {
  it("handles string", () => {
    expect(processValue("hello")).toBe('string: "HELLO"')
  })
  it("handles number", () => {
    expect(processValue(3.14159)).toBe("number: 3.14")
  })
  it("handles array", () => {
    expect(processValue([1, 2, 3])).toBe("array of 3")
  })
  it("handles null", () => {
    expect(processValue(null)).toBe("null")
  })
  it("handles other", () => {
    expect(processValue({})).toBe("other")
  })
})

// ── Part 3: Custom predicate functions with switch(true) ──────────────────────
//
// Predicates that classify values; switch(true) dispatches on them.

type Success<T> = { ok: true; value: T }
type Failure     = { ok: false; error: string }
type Result<T>   = Success<T> | Failure

function isSuccess<T>(r: Result<T>): r is Success<T> { return r.ok }
function isFailure<T>(r: Result<T>): r is Failure     { return !r.ok }

function handleResult<T>(result: Result<T>): string {
  switch (true) {
    case isSuccess(result):
      return `ok: ${JSON.stringify(result.value)}`
    case isFailure(result):
      return `error: ${result.error}`
    default:
      return "unreachable"
  }
}

describe("handleResult switch(true)", () => {
  it("handles success", () => {
    const r: Result<number> = { ok: true, value: 42 }
    expect(handleResult(r)).toBe("ok: 42")
  })
  it("handles failure", () => {
    const r: Result<number> = { ok: false, error: "not found" }
    expect(handleResult(r)).toBe("error: not found")
  })
})

// ── Part 4: Range checking ────────────────────────────────────────────────────
//
// switch(true) is particularly readable for multi-range number classification.

function classify(n: number): string {
  switch (true) {
    case n < 0:
      return "negative"
    case n === 0:
      return "zero"
    case n < 10:
      return "small"
    case n < 100:
      return "medium"
    default:
      return "large"
  }
}

describe("classify with switch(true)", () => {
  it.each([
    [-5, "negative"],
    [0,  "zero"],
    [7,  "small"],
    [42, "medium"],
    [999, "large"],
  ])("classify(%i) === %s", (n, expected) => {
    expect(classify(n)).toBe(expected)
  })
})
