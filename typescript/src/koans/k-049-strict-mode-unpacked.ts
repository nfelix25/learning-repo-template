// ─── k-049: Strict Mode Unpacked (TypeScript 6.0) ────────────────────────────
//
// `"strict": true` is a shorthand for a bundle of individual flags. Understanding
// EACH flag lets you know exactly what protection you get — and what breaks when
// you turn strict on for an existing project.
//
// The strict bundle (as of TS 6.0):
//   strictNullChecks           — null/undefined are separate types, not subtypes of everything
//   strictFunctionTypes        — contravariant parameter checking for function types
//   strictBindCallApply        — typed bind/call/apply
//   strictPropertyInitialization — class properties must be initialized in constructor
//   noImplicitAny              — implicit `any` is an error
//   noImplicitThis             — `this` in non-class context must be typed
//   alwaysStrict               — emit "use strict"; parse in strict mode
//   useUnknownInCatchVariables — catch variables are `unknown` not `any` (TS 4.0+)
//
// TS 6.0 additions: strictBuiltinIteratorReturn — stricter lib types for iterators.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest"
import type { Expect, Equal } from "../utils/type-utils.js"

// ── Part 1: strictNullChecks ──────────────────────────────────────────────────
//
// Without strictNullChecks: null/undefined are assignable to any type.
// With it: null and undefined are their own types.
// The most important flag — enables accurate modeling of optionality.

function getLength(s: string | null): number {
  // Without strict: s.length would compile (crash at runtime on null)
  // With strict: must narrow first
  if (s === null) return 0
  return s.length
}

describe("strictNullChecks — null as own type", () => {
  it("handles null explicitly", () => {
    expect(getLength(null)).toBe(0)
    expect(getLength("hello")).toBe(5)
  })
})

// ── Part 2: useUnknownInCatchVariables ────────────────────────────────────────
//
// Before TS 4.0 / strictNullChecks: catch variables were implicitly `any`.
// With useUnknownInCatchVariables: they're `unknown` — you must narrow before use.
//
// This forces proper error handling. Before this flag, catch(e) => e.message
// compiled but would crash if `e` wasn't an Error object.

function safelyGetErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message
  if (typeof e === "string") return e
  return String(e)
}

function trySomething(shouldThrow: boolean): string {
  try {
    if (shouldThrow) throw new TypeError("type error")
    return "success"
  } catch (e) {
    // e is `unknown` in strict mode — must narrow
    return safelyGetErrorMessage(e)
  }
}

describe("useUnknownInCatchVariables", () => {
  it("catches Error objects correctly", () => {
    expect(trySomething(true)).toBe("type error")
  })
  it("returns success when no throw", () => {
    expect(trySomething(false)).toBe("success")
  })
})

// ── Part 3: strictPropertyInitialization ─────────────────────────────────────
//
// Class properties declared without an initializer must be assigned in the
// constructor — otherwise TS errors. Use `!` assertion to opt out when you
// know a property will be assigned before use (dependency injection, beforeEach).

class UserRepository {
  private db: Map<string, string>  // initialized in constructor — OK

  constructor() {
    this.db = new Map()
  }

  set(id: string, name: string): void {
    this.db.set(id, name)
  }

  get(id: string): string | undefined {
    return this.db.get(id)
  }
}

describe("strictPropertyInitialization", () => {
  it("property must be initialized before use", () => {
    const repo = new UserRepository()
    repo.set("1", "Alice")
    expect(repo.get("1")).toBe("Alice")
    expect(repo.get("2")).toBeUndefined()
  })
})

// ── Part 4: strictFunctionTypes — contravariance ──────────────────────────────
//
// Demonstrated via type assertions — see k-037 for full explanation.
// With strictFunctionTypes, function-typed parameters are checked contravariantly.

type HandleString        = (x: string) => void
type HandleStringOrNum   = (x: string | number) => void

// Contravariant: accepts MORE is safe where LESS is expected
type _4a = Expect<Equal<HandleStringOrNum extends HandleString ? true : false, true>>
// Covariant direction is NOT safe
type _4b = Expect<Equal<HandleString extends HandleStringOrNum ? true : false, false>>

describe("strictFunctionTypes koan", () => {
  it.todo("verified via pnpm typecheck")
})

// ── Part 5: noImplicitAny — explicit types at boundaries ─────────────────────
//
// noImplicitAny requires parameters and return types to be explicitly typed
// when TypeScript can't infer them. Forces you to think about your API contracts.
//
// These functions compile because all types are explicit or inferable.

function double(n: number): number {
  return n * 2
}

function greet(name: string): string {
  return `Hello, ${name}!`
}

describe("noImplicitAny — explicit types", () => {
  it("typed functions compile and work", () => {
    expect(double(5)).toBe(10)
    expect(greet("world")).toBe("Hello, world!")
  })
})

// ── Part 6: strictBuiltinIteratorReturn (TS 6.0) ──────────────────────────────
//
// TS 6.0 added `strictBuiltinIteratorReturn` to the strict bundle.
// Built-in iterators like Array iterator, Map iterator, etc. now have a typed
// `TReturn` of `undefined` instead of `any`, preventing accidentally using the
// return value of an iterator's `.next()` call when it's done.
//
// In practice: the IteratorResult type is now more precise.

describe("strictBuiltinIteratorReturn (TS 6.0)", () => {
  it("array iterator's done result has undefined value", () => {
    const arr = [1, 2]
    const iter = arr[Symbol.iterator]()
    iter.next()  // { value: 1, done: false }
    iter.next()  // { value: 2, done: false }
    const done = iter.next()  // { value: undefined, done: true }
    expect(done.done).toBe(true)
    expect(done.value).toBeUndefined()
  })
})
