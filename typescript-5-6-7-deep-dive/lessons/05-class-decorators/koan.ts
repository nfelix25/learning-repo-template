import type { Expect, Equal, Extends } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 05 — Class Decorators                                   [TS 5.0]
// ─────────────────────────────────────────────────────────────────────────
// SIGNATURE:
//   function myDecorator<T extends new (...args: unknown[]) => unknown>(
//     target: T,
//     context: ClassDecoratorContext<T>
//   ): T | void
//
//   - `target` is the class constructor itself
//   - Return a new class to REPLACE the original (or void/undefined to keep it)
//   - Returning a new class lets you add/override static or instance members
//
// THE CONTEXT OBJECT for class decorators:
//   context.kind       === "class"
//   context.name       — the class name (string or undefined for anonymous)
//   context.metadata   — the shared Symbol.metadata object (TS 5.2+)
//   context.addInitializer(fn)
//     — registers a callback that runs after the class is fully defined
//     — useful for post-class-definition setup (registering in a registry, etc.)
//
// TWO PATTERNS:
//
//   Pattern 1 — Augment via addInitializer (runs after construction):
//     function sealed(target, ctx) {
//       ctx.addInitializer(function(this) { Object.seal(this) })
//     }
//
//   Pattern 2 — Return a subclass to extend/override behaviour:
//     function logged(target, ctx) {
//       return class extends target {
//         constructor(...args) {
//           console.log(`Constructing ${ctx.name}`)
//           super(...args)
//         }
//       }
//     }
//
// TYPING THE REPLACEMENT CLASS:
//   When returning a class, its type must be a subtype of target.
//   Use `extends target` to ensure the replacement is assignable.
//   TS infers the return type — you usually don't need explicit annotations.
//
// REAL-WORLD USES:
//   - @injectable (DI registration)
//   - @singleton (enforce one-instance constraint)
//   - @serializable (add toJSON/fromJSON methods)
//   - @tracked (proxy for reactivity systems)
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — @sealed decorator ────────────────────────────────────────
// A `sealed` decorator calls Object.seal on each new instance.
// Object.seal prevents adding new properties to an object.
//
// TODO: Implement the @sealed decorator.
// Use `context.addInitializer` so sealing happens after each construction.
// The `this` inside addInitializer callback refers to the new instance.

function sealed<T extends new (...args: unknown[]) => unknown>(
  target: T,
  context: ClassDecoratorContext<T>
): void {
  // TODO: register an initializer that seals `this`
}

@sealed
class Config {
  host = "localhost"
  port = 3000
}

// After your implementation, adding a new property should throw at runtime.
// The TypeScript type is unaffected (sealing is a runtime constraint):
type _A1 = Expect<Equal<keyof InstanceType<typeof Config>, "host" | "port">>

// ── Exercise B — @logged decorator ────────────────────────────────────────
// A `logged` decorator wraps the class to log its name on every construction.
// It should return a subclass of the decorated class.
//
// TODO: Implement @logged.
// Return a new class that extends `target`, logs the class name, then calls super.

function logged<T extends abstract new (...args: any) => any>(
  target: T,
  context: ClassDecoratorContext<T>
): T {
  // TODO: return a new class that logs `Constructing ${context.name}` then calls super
  return target // replace this line
}

@logged
class Service {
  name: string
  constructor(name: string) {
    this.name = name
  }
}

// The returned class must still be assignable to the original:
type _B1 = Expect<Extends<typeof Service, new (name: string) => { name: string }>>

// ── Exercise C — decorator that adds a static property ────────────────────
// A decorator can return a subclass that adds static members.
//
// TODO: Implement @withVersion so the decorated class gets a static `version` string.

function withVersion<T extends new (...args: unknown[]) => unknown>(
  target: T,
  _context: ClassDecoratorContext<T>
) {
  // TODO: return a class extending target with a static `version = "1.0.0"` property
  return target // replace this line
}

@withVersion
class App {
  start() {}
}

// After your implementation:
// @ts-expect-error — version doesn't exist yet (remove this line after implementing)
type _C1 = Expect<Equal<typeof App.version, string>>

// ── Exercise D — reading context.name ────────────────────────────────────
// context.name contains the class name. Write a decorator that stores it.

const registry: string[] = []

function register<T extends new (...args: unknown[]) => unknown>(
  target: T,
  context: ClassDecoratorContext<T>
): void {
  // TODO: push context.name into registry (if it's a string)
}

@register class UserModel {}
@register class PostModel {}

// After your fix, registry should contain the class names:
type _D1 = Expect<Equal<typeof registry, string[]>>
