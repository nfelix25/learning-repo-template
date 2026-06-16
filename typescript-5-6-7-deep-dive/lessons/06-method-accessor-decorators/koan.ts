import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 06 — Method and Accessor Decorators                     [TS 5.0]
// ─────────────────────────────────────────────────────────────────────────
// METHOD DECORATOR SIGNATURE:
//   function deco<This, Args extends unknown[], Return>(
//     target: (this: This, ...args: Args) => Return,
//     context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
//   ): ((this: This, ...args: Args) => Return) | void
//
//   - `target` is the original method function
//   - Return a replacement function (same signature) or void to keep original
//   - The `This` type param lets the decorator know what class it's on
//
// ACCESSOR DECORATOR SIGNATURE:
//   Applied to `accessor` fields (get+set pair declared with `accessor` keyword):
//   function deco<This, Value>(
//     target: ClassAccessorDecoratorTarget<This, Value>,
//     context: ClassAccessorDecoratorContext<This, Value>
//   ): ClassAccessorDecoratorResult<This, Value> | void
//
//   ClassAccessorDecoratorTarget has { get(): Value, set(v: Value): void }
//   ClassAccessorDecoratorResult has { get?(), set?(), init?() }
//   — returning `init` lets you transform the initial value
//
// THE `accessor` KEYWORD (TS 5.0):
//   `accessor` is new syntax. It creates a private backing field plus
//   a public getter+setter as a unit:
//     class Foo { accessor value = 42 }
//   is roughly:   private #value = 42; get value() { return this.#value }
//                                       set value(v) { this.#value = v }
//
// METHOD CONTEXT vs ACCESSOR CONTEXT:
//   Both have kind, name, metadata, addInitializer, and access.
//   context.access for methods: { get(obj) } — reads the method from an instance
//   context.access for accessors: { get(obj), set(obj, v), has(obj) }
//
// REAL-WORLD USES:
//   @memoize — cache method return values per-instance
//   @validate — check arguments before calling the method
//   @clamp    — constrain setter values to a range
//   @computed — mark an accessor as derived/reactive
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — @memoize method decorator ───────────────────────────────
// Memoize caches the return value of a method on the instance.
// On subsequent calls with the same args, return the cached result.
//
// For simplicity: cache using JSON.stringify(args) as the key.
// Store the cache in a WeakMap<object, Map<string, unknown>>.
//
// TODO: Implement the @memoize decorator.

const memoCache = new WeakMap<object, Map<string, unknown>>()

function memoize<This extends object, Args extends unknown[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
): (this: This, ...args: Args) => Return {
  // TODO: return a wrapped function that:
  //   1. Checks the memoCache for a cached result keyed by JSON.stringify(args)
  //   2. Returns cached result if found
  //   3. Otherwise calls the original, caches and returns the result
  return target // replace this line
}

class Calculator {
  callCount = 0

  @memoize
  square(n: number): number {
    this.callCount++
    return n * n
  }
}

// After your implementation, the second call should use the cache:
const calc = new Calculator()
const _r1 = calc.square(4)   // callCount → 1
const _r2 = calc.square(4)   // callCount stays 1 (cache hit)
type _A1 = Expect<Equal<typeof _r1, number>>

// ── Exercise B — @clamp accessor decorator ───────────────────────────────
// Clamp intercepts the setter on an `accessor` field and constrains the
// value to [min, max].
//
// TODO: Implement the @clamp factory (takes min, max, returns a decorator).

function clamp(min: number, max: number) {
  return function<This>(
    target: ClassAccessorDecoratorTarget<This, number>,
    _context: ClassAccessorDecoratorContext<This, number>
  ): ClassAccessorDecoratorResult<This, number> {
    // TODO: return an object with a custom `set` that clamps the value
    // before storing it using target.set.
    return {}  // replace this line
  }
}

class Volume {
  @clamp(0, 100)
  accessor level = 50
}

const vol = new Volume()
vol.level = 150   // should be clamped to 100
vol.level = -10   // should be clamped to 0
type _B1 = Expect<Equal<typeof vol.level, number>>

// ── Exercise C — accessing context.name ──────────────────────────────────
// context.name is the method name. Use it to build a debug-aware wrapper.
//
// TODO: Implement @trace — logs "<className>.<methodName> called" before
// calling the original. Use context.name for the method name.
// Hint: There's no direct access to the class name in method context —
// you can use `this.constructor.name` at call time.

function trace<This extends object, Args extends unknown[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
): (this: This, ...args: Args) => Return {
  // TODO: return a wrapper that logs the call then invokes target
  return target // replace this line
}

class ApiClient {
  @trace
  fetch(url: string): string {
    return `data from ${url}`
  }
}

// Type is preserved:
type _C1 = Expect<Equal<
  ReturnType<ApiClient["fetch"]>,
  string
>>
