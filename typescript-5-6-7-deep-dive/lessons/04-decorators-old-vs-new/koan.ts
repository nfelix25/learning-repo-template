import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 04 — Stage-3 Decorators vs Experimental Decorators      [TS 5.0]
// ─────────────────────────────────────────────────────────────────────────
// This is a conceptual foundation lesson. Read the comments carefully before
// touching the exercises in lessons 05–10.
//
// TWO COMPLETELY SEPARATE SYSTEMS:
//
//   Experimental decorators (pre-TS 5.0):
//     - Enabled by `"experimentalDecorators": true` in tsconfig
//     - Based on an old TC39 proposal that was later abandoned
//     - Decorators receive (target, propertyKey, descriptor) — no context object
//     - Decorator factories need explicit return type annotations
//     - Still widely used in Angular (which ships its own decorator transform)
//
//   Stage-3 decorators (TS 5.0+, default when experimentalDecorators is absent):
//     - Based on the TC39 stage-3 proposal (now stage 4, shipping natively)
//     - Decorators receive (value, context) — where context has kind, name, metadata
//     - Type-safe by design: context.kind tells you what you decorated
//     - Works without emit transformation — decorators are real JS
//     - This is what all lessons 05–10 use
//
// THE KEY STRUCTURAL DIFFERENCE:
//
//   // OLD (experimentalDecorators)
//   function log(target: any, key: string, descriptor: PropertyDescriptor) {
//     // target = prototype, key = "myMethod", descriptor = { value: fn }
//   }
//
//   // NEW (stage-3)
//   function log<T extends (...args: unknown[]) => unknown>(
//     fn: T,
//     context: ClassMethodDecoratorContext<unknown, T>
//   ): T | void {
//     // fn = the method itself, context = { kind: "method", name: "myMethod", ... }
//   }
//
// THE CONTEXT OBJECT (stage-3 — used in all following lessons):
//
//   All decorators receive a context as their second argument. The shape
//   depends on what is being decorated (context.kind):
//
//   ┌────────────────────┬──────────────────────────────────────────────┐
//   │ Decorated target   │ Context type                                 │
//   ├────────────────────┼──────────────────────────────────────────────┤
//   │ class              │ ClassDecoratorContext                        │
//   │ method             │ ClassMethodDecoratorContext                  │
//   │ accessor (get/set) │ ClassAccessorDecoratorContext                │
//   │ field              │ ClassFieldDecoratorContext                   │
//   │ getter             │ ClassGetterDecoratorContext                  │
//   │ setter             │ ClassSetterDecoratorContext                  │
//   └────────────────────┴──────────────────────────────────────────────┘
//
//   Common fields on ALL context objects:
//     context.kind     — what is being decorated ("class", "method", "field", ...)
//     context.name     — the name of the decorated item (or symbol)
//     context.metadata — the shared metadata object for the class (TS 5.2+)
//
//   Method/accessor-specific:
//     context.access  — { get(obj): V, set(obj, v): void } — live access to the value
//     context.addInitializer(fn) — register a function to run after construction
//
// RETURN VALUES:
//   - Class decorator:    return a new class (or undefined for no change)
//   - Method decorator:   return a replacement function (or undefined)
//   - Field decorator:    return an initializer function (or undefined)
//   - Accessor decorator: return { get?, set?, init? } (or undefined)
//
// WHY THE CHANGE WAS NECESSARY:
//   The old system had no standard way to:
//   1. Know at runtime what kind of thing you decorated (class? method? field?)
//   2. Share metadata between decorators on the same class
//   3. Write type-safe decorators without `any` in the signature
//   4. Defer work until after the entire class is defined
//   The new system solves all four via the context object and Symbol.metadata.
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — read the context object ──────────────────────────────────
// These type assertions verify you understand the context shapes.
// No code change needed — just confirm your mental model by checking
// whether each assertion compiles.

// A class decorator's context has kind "class":
type _A1 = Expect<Equal<ClassDecoratorContext["kind"], "class">>

// A method decorator's context has kind "method":
type _A2 = Expect<Equal<ClassMethodDecoratorContext["kind"], "method">>

// A field decorator's context has kind "field":
type _A3 = Expect<Equal<ClassFieldDecoratorContext["kind"], "field">>

// An accessor decorator's context has kind "accessor":
type _A4 = Expect<Equal<ClassAccessorDecoratorContext["kind"], "accessor">>

// ── Exercise B — decorator return type rules ──────────────────────────────
// Match each decorator kind to its valid return type.
// Check the TypeScript built-in types for the exact shapes.

// A class decorator can return: a new class or void
type ClassDecoratorReturn = Parameters<
  (target: typeof Object, ctx: ClassDecoratorContext) => typeof Object | void
>[1]  // just grabbing the context type to examine
type _B1 = Expect<Equal<ClassDecoratorReturn, ClassDecoratorContext>>

// A method decorator receives the original function as first arg:
declare function methodDecorator<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ctx: ClassMethodDecoratorContext<unknown, T>
): T | void
type _B2 = Expect<Equal<Parameters<typeof methodDecorator>[0], (...args: unknown[]) => unknown>>

// ── Exercise C — stage-3 syntax compiles without experimentalDecorators ───
// The following class uses a stage-3 decorator. No special tsconfig needed.
// This would NOT compile under experimentalDecorators: true (different system).

function noop<T>(_: T, _ctx: ClassDecoratorContext): void {}

@noop
class ExampleClass {
  value = 42
}

// If this compiles, stage-3 decorators are active:
type _C1 = Expect<Equal<InstanceType<typeof ExampleClass>["value"], number>>
