import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 09 — Decorator Metadata (Symbol.metadata)               [TS 5.2]
// ─────────────────────────────────────────────────────────────────────────
// WHAT IS DECORATOR METADATA:
//   A standardized way for decorators on the same class to share data and
//   for consumers to read that data after the class is defined.
//
//   Every class gets a `[Symbol.metadata]` property that is:
//   - An object (initially null/empty)
//   - Accessible from any decorator via `context.metadata`
//   - Readable from outside via `MyClass[Symbol.metadata]`
//   - Inherited: subclass metadata chains to parent metadata via prototype
//
// HOW TO USE IT:
//   Inside any decorator:
//     function required(_: undefined, ctx: ClassFieldDecoratorContext) {
//       (ctx.metadata as Record<string, unknown[]>).required ??= []
//       ;(ctx.metadata as Record<string, unknown[]>).required.push(String(ctx.name))
//     }
//
//   After class definition:
//     const meta = MyClass[Symbol.metadata]
//     const requiredFields = (meta as Record<string, unknown>)?.required
//
// DIFFERENCE FROM emitDecoratorMetadata (OLD SYSTEM):
//   The old `emitDecoratorMetadata: true` flag used Reflect.metadata to store
//   type information emitted by tsc (e.g., the constructor's param types).
//   It required `reflect-metadata` polyfill and produced fragile output.
//
//   Symbol.metadata is:
//   - Part of the TC39 standard (no polyfill needed in new environments)
//   - Controlled by YOU (you decide what goes in, no compiler magic)
//   - Type-safe when you define a typed metadata interface
//   - Inherited cleanly via prototype (no manual merge logic)
//
// INHERITANCE:
//   When a class extends another:
//   - ChildClass[Symbol.metadata].__proto__ === ParentClass[Symbol.metadata]
//   - Reading a metadata key walks the prototype chain
//   - Writing to a key only affects the child's OWN metadata
//
// REAL-WORLD USES:
//   - Validation schemas (store validation rules per field)
//   - ORM column definitions (store DB column info per field)
//   - DI: mark injectable params (store injection tokens per class)
//   - Form builders (collect field metadata for rendering)
// ═══════════════════════════════════════════════════════════════════════════

// ── Set up: typed metadata interface ────────────────────────────────────
// Declare what we'll store in metadata for this lesson.
interface FieldMeta {
  required?: string[]
  minLength?: Record<string, number>
}

// ── Exercise A — @required writes to context.metadata ────────────────────
// TODO: Implement @required.
// Cast context.metadata to FieldMeta and push context.name into .required[].

function required(
  _target: undefined,
  context: ClassFieldDecoratorContext
): void {
  const meta = context.metadata as FieldMeta
  // TODO: initialise meta.required if needed, then push the field name
}

// ── Exercise B — @minLength(n) writes per-field config ───────────────────
// TODO: Implement @minLength(n).
// Store the min length in context.metadata.minLength[fieldName] = n.

function minLength(n: number) {
  return function(
    _target: undefined,
    context: ClassFieldDecoratorContext
  ): void {
    const meta = context.metadata as FieldMeta
    // TODO: initialise meta.minLength if needed, then set [fieldName] = n
  }
}

// ── Apply decorators ─────────────────────────────────────────────────────

class SignupForm {
  @required
  @minLength(3)
  username: string = ""

  @required
  @minLength(8)
  password: string = ""

  nickname: string = ""
}

// ── Exercise C — read metadata back ──────────────────────────────────────
// After the class is defined, its metadata is readable via Symbol.metadata.

const meta = SignupForm[Symbol.metadata] as FieldMeta | null

// After your implementation:
// meta.required should contain ["username", "password"]
// meta.minLength should contain { username: 3, password: 8 }

type _C1 = Expect<Equal<typeof meta, FieldMeta | null>>

// ── Exercise D — inheritance ──────────────────────────────────────────────
// Metadata is inherited via prototype chain.
//
// TODO: Verify that a subclass can see parent metadata AND has its own.

class AdminForm extends SignupForm {
  @required
  adminCode: string = ""
}

// AdminForm[Symbol.metadata] should contain "adminCode" in required.
// It should also see "username" and "password" from the parent (via proto chain).
const adminMeta = AdminForm[Symbol.metadata] as FieldMeta | null
type _D1 = Expect<Equal<typeof adminMeta, FieldMeta | null>>

// The parent metadata is NOT modified by the child:
const parentMeta = SignupForm[Symbol.metadata] as FieldMeta | null
// parentMeta.required should still only have ["username", "password"]
type _D2 = Expect<Equal<typeof parentMeta, FieldMeta | null>>
