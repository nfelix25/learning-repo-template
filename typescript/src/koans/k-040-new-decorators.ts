// ─── k-040: New Decorators (TC39 Stage 3 / TypeScript 5.0) ───────────────────
//
// TypeScript 5.0 introduced support for the TC39 "stage 3" decorator proposal —
// a complete rewrite of the old `experimentalDecorators` system.
//
// Key differences from old decorators:
// - No `experimentalDecorators: true` needed (new syntax works by default in TS 5+)
// - Decorators receive a `context` object instead of target/key/descriptor separately
// - Return value replaces the decorated thing (class decorators return a new class;
//   method decorators return a new function)
// - TypeScript infers types through decorators properly
//
// Types used by new decorators (from lib.decorators.d.ts):
//   ClassDecoratorContext, ClassMethodDecoratorContext, ClassFieldDecoratorContext
//   ClassGetterDecoratorContext, ClassSetterDecoratorContext
//   ClassAccessorDecoratorContext, ClassAccessorDecoratorTarget
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, vi } from "vitest"

// ── Part 1: Class decorator ───────────────────────────────────────────────────
//
// A class decorator receives the class constructor and a ClassDecoratorContext.
// Returning a new class replaces the original.
//
// `sealed` prevents subclassing by overriding the static method at runtime.
// The decorator adds a `sealed` property to the class so tests can verify it ran.

function sealed<T extends new (...args: any[]) => {}>(
  target: T,
  context: ClassDecoratorContext<T>
): T {
  return class extends target {
    static sealed = true
  } as T & { sealed: boolean }
}

@sealed
class Point {
  constructor(public x: number, public y: number) {}
}

describe("@sealed class decorator", () => {
  it("adds sealed property to the class", () => {
    expect((Point as any).sealed).toBe(true)
  })
  it("still constructs normally", () => {
    const p = new Point(3, 4)
    expect(p.x).toBe(3)
    expect(p.y).toBe(4)
  })
})

// ── Part 2: Method decorator ──────────────────────────────────────────────────
//
// A method decorator receives the method function and a ClassMethodDecoratorContext.
// Returning a new function replaces the method.
//
// `log` wraps the method to print "calling <name>" before it runs.
// Track calls via the log array for testability.

const callLog: string[] = []

function log<T, Args extends unknown[], R>(
  method: (this: T, ...args: Args) => R,
  context: ClassMethodDecoratorContext<T, (this: T, ...args: Args) => R>
): (this: T, ...args: Args) => R {
  return function (this: T, ...args: Args): R {
    callLog.push(`calling ${String(context.name)}`)
    return method.apply(this, args)
  }
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b
  }

  @log
  multiply(a: number, b: number): number {
    return a * b
  }
}

describe("@log method decorator", () => {
  it("logs method calls", () => {
    callLog.length = 0
    const calc = new Calculator()
    calc.add(1, 2)
    calc.multiply(3, 4)
    expect(callLog).toEqual(["calling add", "calling multiply"])
  })
  it("preserves return value", () => {
    const calc = new Calculator()
    expect(calc.add(5, 6)).toBe(11)
    expect(calc.multiply(3, 7)).toBe(21)
  })
})

// ── Part 3: Accessor decorator for clamping ───────────────────────────────────
//
// Field decorator initializers only intercept the INITIAL value (the `= expr` part).
// Constructor assignments bypass them entirely. For per-assignment enforcement,
// use the `accessor` keyword so the decorator can intercept every `set`.
//
// `nonNegative` ensures a numeric accessor is always set to max(0, value).

function nonNegative<T extends object>(
  target: ClassAccessorDecoratorTarget<T, number>,
  _context: ClassAccessorDecoratorContext<T, number>
): ClassAccessorDecoratorResult<T, number> {
  return {
    get(this: T): number {
      return target.get.call(this)
    },
    set(this: T, value: number): void {
      target.set.call(this, Math.max(0, value))
    },
  }
}

class BankAccount {
  @nonNegative
  accessor balance: number = 0

  constructor(initialBalance: number) {
    this.balance = initialBalance  // goes through the accessor setter
  }
}

describe("@nonNegative accessor decorator", () => {
  it("clamps negative initial value to 0", () => {
    const account = new BankAccount(-100)
    expect(account.balance).toBe(0)
  })
  it("allows positive initial value", () => {
    const account = new BankAccount(500)
    expect(account.balance).toBe(500)
  })
})

// ── Part 4: Accessor decorator ────────────────────────────────────────────────
//
// The new `accessor` keyword creates an auto-accessor: a backing field with
// a getter/setter pair. Accessor decorators can intercept get/set.
//
// `clamp(min, max)` is a decorator factory that clamps the value on set.

function clamp(min: number, max: number) {
  return function <T extends object>(
    target: ClassAccessorDecoratorTarget<T, number>,
    context: ClassAccessorDecoratorContext<T, number>
  ): ClassAccessorDecoratorResult<T, number> {
    return {
      get(this: T): number {
        return target.get.call(this)
      },
      set(this: T, value: number): void {
        target.set.call(this, Math.min(Math.max(min, value), max))
      },
    }
  }
}

class Slider {
  @clamp(0, 100)
  accessor value: number = 50
}

describe("@clamp accessor decorator", () => {
  it("clamps values on set", () => {
    const s = new Slider()
    s.value = 150
    expect(s.value).toBe(100)
    s.value = -10
    expect(s.value).toBe(0)
    s.value = 75
    expect(s.value).toBe(75)
  })
})
