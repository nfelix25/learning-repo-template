// ─── k-053: Control Flow Improvements (TypeScript 6.0) ───────────────────────
//
// TypeScript 6.0 significantly improved narrowing in several scenarios:
//
// 1. Narrowing through complex boolean expressions (&&, ||, ??)
//    Previously, intermediate variables lost narrowing. TS 6.0 tracks narrowing
//    through assignments and boolean chains better.
//
// 2. Narrowing for `in` operator with optional properties
//    `"key" in obj` where obj has optional keys now narrows more precisely.
//
// 3. `--isolatedDeclarations` (stable in 5.5, enhanced in 6.0)
//    Requires explicit return type annotations for exported functions — enables
//    parallel type-checking in build tools (Vite, ESBuild, Turbopack).
//
// 4. Better `satisfies` integration with narrowing:
//    `satisfies` checks type at use site without widening.
//
// This koan focuses on the narrowing improvements you'll encounter in practice.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest"
import type { Expect, Equal } from "../utils/type-utils.js"

// ── Part 1: Narrowing through boolean expressions ─────────────────────────────
//
// TypeScript now narrows correctly through && chains and intermediate results.

type User = { name: string; age: number }
type Admin = User & { role: "admin"; clearance: number }

function isAdmin(u: User): u is Admin {
  return "clearance" in u && (u as Admin).role === "admin"
}

function processUser(user: User | null): string {
  if (user === null) return "no user"
  if (isAdmin(user)) return `admin ${user.name} (clearance ${user.clearance})`
  return `user ${user.name}`
}

describe("narrowing through predicate + null check", () => {
  it("handles null", () => {
    expect(processUser(null)).toBe("no user")
  })
  it("handles admin", () => {
    const admin: Admin = { name: "Alice", age: 30, role: "admin", clearance: 5 }
    expect(processUser(admin)).toBe("admin Alice (clearance 5)")
  })
  it("handles regular user", () => {
    expect(processUser({ name: "Bob", age: 25 })).toBe("user Bob")
  })
})

// ── Part 2: `satisfies` operator (TS 4.9, extended narrowing in 6.0) ──────────
//
// `satisfies` validates that a value matches a type WITHOUT widening the type.
// This preserves literal types for IDE autocomplete while still type-checking.

type PaletteColor = "red" | "green" | "blue"
type Palette = Record<PaletteColor, string>

// Without `satisfies`: typed as Palette — loses literal key information
// With `satisfies`: type is the exact literal object type

const colors = {
  red:   "#ff0000",
  green: "#008000",
  blue:  "#0000ff",
} satisfies Palette

// `colors.red` is `string` (from the value), not widened — and Palette check passes
type _2a = Expect<Equal<typeof colors.red, string>>

describe("satisfies operator", () => {
  it("preserves runtime values", () => {
    expect(colors.red).toBe("#ff0000")
  })
  it("all required keys are present", () => {
    const keys = Object.keys(colors).sort()
    expect(keys).toEqual(["blue", "green", "red"])
  })
})

// ── Part 3: Narrowing with `in` operator ─────────────────────────────────────
//
// The `in` operator narrows discriminated unions and objects with optional keys.

type Dog  = { kind: "dog"; bark(): void }
type Cat  = { kind: "cat"; meow(): void }
type Bird = { kind: "bird"; fly(): void; sing?: () => void }

type Animal = Dog | Cat | Bird

function makeSound(animal: Animal): string {
  switch (animal.kind) {
    case "dog":  return "woof"
    case "cat":  return "meow"
    case "bird":
      if ("sing" in animal && animal.sing) return "tweet (singing)"
      return "tweet"
  }
}

describe("narrowing with in + discriminated unions", () => {
  it("dog barks", () => {
    const d: Dog = { kind: "dog", bark() {} }
    expect(makeSound(d)).toBe("woof")
  })
  it("cat meows", () => {
    const c: Cat = { kind: "cat", meow() {} }
    expect(makeSound(c)).toBe("meow")
  })
  it("bird tweets", () => {
    const b: Bird = { kind: "bird", fly() {} }
    expect(makeSound(b)).toBe("tweet")
  })
  it("singing bird", () => {
    const b: Bird = { kind: "bird", fly() {}, sing() {} }
    expect(makeSound(b)).toBe("tweet (singing)")
  })
})

// ── Part 4: Narrowing after assignment in loop ───────────────────────────────
//
// TS 6.0 improved narrowing for variables reassigned inside loops.
// The type of `result` narrows correctly based on the control flow.

function findFirst<T>(items: T[], predicate: (x: T) => boolean): T | undefined {
  let result: T | undefined = undefined
  for (const item of items) {
    if (predicate(item)) {
      result = item
      break
    }
  }
  return result
}

describe("findFirst", () => {
  it("finds the first matching item", () => {
    expect(findFirst([1, 2, 3, 4], n => n > 2)).toBe(3)
  })
  it("returns undefined when no match", () => {
    expect(findFirst([1, 2, 3], n => n > 10)).toBeUndefined()
  })
})

// ── Part 5: Narrowing with early return + exhaustive check ───────────────────
//
// TypeScript tracks that after each early return, the remaining type is narrower.
// In the `never` position, TypeScript guarantees exhaustiveness.

type Shape =
  | { kind: "circle"; r: number }
  | { kind: "square"; side: number }
  | { kind: "triangle"; base: number; height: number }

function area(shape: Shape): number {
  if (shape.kind === "circle")   return Math.PI * shape.r ** 2
  if (shape.kind === "square")   return shape.side ** 2
  if (shape.kind === "triangle") return 0.5 * shape.base * shape.height
  // TypeScript knows this is unreachable — shape is `never` here
  const _exhaustive: never = shape
  return _exhaustive
}

describe("exhaustive shape area", () => {
  it("circle", () => expect(area({ kind: "circle", r: 1 })).toBeCloseTo(Math.PI))
  it("square", () => expect(area({ kind: "square", side: 4 })).toBe(16))
  it("triangle", () => expect(area({ kind: "triangle", base: 6, height: 4 })).toBe(12))
})
