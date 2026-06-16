// ─── k-048: Uninitialized Variable Detection (TypeScript 5.7) ────────────────
//
// TypeScript 5.7 introduced stricter detection of variables that are used before
// being assigned in some code paths. Previously, TypeScript only caught obvious
// cases; 5.7 improved analysis of control flow to catch more subtle patterns.
//
// The key flag is `--strictNullChecks` combined with TS 5.7's improved control
// flow analysis. A variable declared with `let x: T` (no initializer) must be
// provably assigned on all paths before being read.
//
// Also introduced in 5.7: `--erasableSyntaxOnly` and improvements to
// `--isolatedDeclarations` (incremental emit for large codebases).
//
// This koan focuses on:
// 1. Understanding when variables are "definitely assigned"
// 2. Patterns that fix uninitialized variable errors
// 3. The narrow type inference around initialization
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest"

// ── Part 1: Definite assignment patterns ─────────────────────────────────────
//
// These functions demonstrate patterns that ARE correctly initialized on all paths.
// Understanding these is the key to fixing uninitialized variable errors.

// Pattern A: initialize at declaration
function patternA(condition: boolean): number {
  let x = 0  // initialized at declaration — always safe
  if (condition) x = 42
  return x
}

// Pattern B: initialized on all branches
function patternB(condition: boolean): string {
  let result: string
  if (condition) {
    result = "yes"
  } else {
    result = "no"
  }
  return result  // TypeScript knows both branches assign result
}

// Pattern C: initialized in a loop with a guaranteed iteration
function patternC(items: [string, ...string[]]): string {
  // items is a non-empty tuple — at least one element
  let last = items[0]
  for (const item of items) {
    last = item
  }
  return last
}

describe("definite assignment patterns", () => {
  it("pattern A — init at declaration", () => {
    expect(patternA(true)).toBe(42)
    expect(patternA(false)).toBe(0)
  })
  it("pattern B — all branches assign", () => {
    expect(patternB(true)).toBe("yes")
    expect(patternB(false)).toBe("no")
  })
  it("pattern C — non-empty tuple guarantees assignment", () => {
    expect(patternC(["a", "b", "c"])).toBe("c")
    expect(patternC(["only"])).toBe("only")
  })
})

// ── Part 2: Definite assignment assertion (!) ─────────────────────────────────
//
// When you know a variable WILL be assigned (e.g., by a setup callback) but
// TypeScript can't prove it, use the definite assignment assertion `!`:
//   let x!: string  — "I promise this will be assigned before use"
//
// This is common in test setup, class properties initialized in `beforeEach`, etc.

class EventuallySet {
  value!: string  // will be set before use

  init(v: string) {
    this.value = v
  }
}

describe("definite assignment assertion", () => {
  it("value is usable after init()", () => {
    const obj = new EventuallySet()
    obj.init("hello")
    expect(obj.value).toBe("hello")
  })
})

// ── Part 3: Type narrowing around initialization ──────────────────────────────
//
// When a variable starts as `undefined` and is assigned later, TypeScript narrows
// the type at each point in the control flow.

function processOptional(items: string[] | undefined): string {
  let result: string | undefined = undefined

  if (items && items.length > 0) {
    result = items.join(", ")
  }

  // result is string | undefined here — must handle both
  return result ?? "(empty)"
}

describe("narrowing around assignment", () => {
  it("returns joined string when items exist", () => {
    expect(processOptional(["a", "b", "c"])).toBe("a, b, c")
  })
  it("returns default when items is empty", () => {
    expect(processOptional([])).toBe("(empty)")
  })
  it("returns default when items is undefined", () => {
    expect(processOptional(undefined)).toBe("(empty)")
  })
})

// ── Part 4: Class field initialization patterns ───────────────────────────────
//
// Classes have several patterns to ensure fields are initialized:
// 1. Initializer at declaration
// 2. Initialized in constructor
// 3. Definite assignment assertion (!)
// 4. Optional field with ?

class Config {
  host: string          // initialized in constructor
  port: number = 3000   // default at declaration
  debug?: boolean       // optional — undefined by default
  secret!: string       // assigned externally before use

  constructor(host: string) {
    this.host = host
  }
}

describe("class field initialization", () => {
  it("all fields are accessible after construction", () => {
    const c = new Config("localhost")
    c.secret = "my-secret"
    expect(c.host).toBe("localhost")
    expect(c.port).toBe(3000)
    expect(c.debug).toBeUndefined()
    expect(c.secret).toBe("my-secret")
  })
})
