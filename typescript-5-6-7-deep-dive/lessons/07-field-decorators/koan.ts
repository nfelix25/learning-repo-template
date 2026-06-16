import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 07 — Field Decorators                                   [TS 5.0]
// ─────────────────────────────────────────────────────────────────────────
// SIGNATURE:
//   function deco<This, Value>(
//     target: undefined,              ← always undefined for fields
//     context: ClassFieldDecoratorContext<This, Value>
//   ): ((initialValue: Value) => Value) | void
//
//   - Unlike method/accessor decorators, `target` is ALWAYS `undefined`.
//     Fields don't have a descriptor — there's nothing to wrap at define time.
//   - To influence the field, return an "initializer function":
//       return (initialValue: Value): Value => { ... return newValue }
//     This function runs for each instance when the field is initialized.
//   - Return void/undefined to keep the field unchanged.
//
// WHY target IS undefined:
//   Class fields are NOT on the prototype. They're set per-instance in the
//   constructor. There's no property descriptor to intercept at class-
//   definition time. The initializer function is the hook instead.
//
// THE INITIALIZER FUNCTION:
//   - Receives the field's declared initial value (e.g., = "hello")
//   - Returns the actual value to use for this instance
//   - Runs in the context of `this` (the instance), so you can call
//     other methods or store values on `this`
//   - Called once per instance construction
//
// CONTEXT OBJECT:
//   context.kind     === "field"
//   context.name     — the field name
//   context.access   — { get(obj), set(obj, v), has(obj) }
//   context.static   — true if it's a static field
//   context.private  — true if it's a private field (#name)
//   context.metadata — the class metadata object
//   context.addInitializer(fn) — runs after the class is defined
//
// REAL-WORLD USES:
//   @nonEmpty     — throw/warn if initialized to empty string
//   @positive     — throw if initialized to negative number
//   @default(val) — replace undefined with a default value
//   @readonly     — Object.defineProperty with writable: false
//   @required     — mark field in metadata (for validation frameworks)
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — @nonEmpty field decorator ───────────────────────────────
// Throws if a string field is initialized to "".
//
// TODO: Implement @nonEmpty.
// It should return an initializer that throws Error if the value is "".

function nonEmpty(
  _target: undefined,
  context: ClassFieldDecoratorContext<unknown, string>
): (initialValue: string) => string {
  // TODO: return an initializer that throws if initialValue === ""
  return (v) => v  // replace this with validation logic
}

class User {
  @nonEmpty
  name: string = "Alice"

  constructor(name: string) {
    this.name = name
  }
}

// After your fix:
const _u1 = new User("Alice")   // should not throw
type _A1 = Expect<Equal<typeof _u1.name, string>>
// new User("") — should throw at runtime

// ── Exercise B — @default(value) decorator factory ────────────────────────
// Replace `undefined` with a default value.
//
// TODO: Implement the @default factory.

function defaultValue<T>(fallback: T) {
  return function(
    _target: undefined,
    _context: ClassFieldDecoratorContext<unknown, T | undefined>
  ): (initialValue: T | undefined) => T {
    // TODO: return an initializer that returns fallback if initialValue is undefined
    return (v) => v as T  // replace this line
  }
}

class Settings {
  @defaultValue("en")
  locale: string | undefined = undefined

  @defaultValue(30)
  timeout: number | undefined = undefined
}

const s = new Settings()
type _B1 = Expect<Equal<typeof s.locale, string>>
type _B2 = Expect<Equal<typeof s.timeout, number>>

// ── Exercise C — @required metadata registration ────────────────────────
// Store required field names on the class via addInitializer.
// (A simplified preview of Symbol.metadata — covered fully in lesson 09.)
//
// TODO: Implement @required.
// Use context.addInitializer to push context.name into a per-class registry
// stored on a WeakMap<Function, string[]>.

const requiredFields = new WeakMap<object, string[]>()

function required(
  _target: undefined,
  context: ClassFieldDecoratorContext
): void {
  // TODO: use context.addInitializer to register context.name in requiredFields
  // Hint: inside addInitializer, `this` is the class constructor
}

class Form {
  @required
  email: string = ""

  @required
  name: string = ""

  password: string = ""
}

// After your fix, requiredFields.get(Form) should be ["email", "name"]
type _C1 = Expect<Equal<string[] | undefined, ReturnType<typeof requiredFields.get>>>
