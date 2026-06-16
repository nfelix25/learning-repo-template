import type { Expect, Equal, NotEqual } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 27 — erasableSyntaxOnly                                 [TS 5.8]
// ─────────────────────────────────────────────────────────────────────────
// This lesson has a per-directory tsconfig.json that enables the flag.
// Run with: tsc -p lessons/27-erasable-syntax-only/tsconfig.json --noEmit
//
// WHAT IS "ERASABLE SYNTAX"?
//   TypeScript syntax that can be removed ("erased") to produce valid
//   JavaScript by simply DELETING the TypeScript-specific parts —
//   no transformation, no code generation.
//
//   ERASABLE (just delete it):
//     let x: string = "hello"     →  let x = "hello"
//     function f(a: number): void →  function f(a) {}
//     type Foo = string           →  (deleted entirely)
//     interface Bar {}            →  (deleted entirely)
//     as string, satisfies T      →  (deleted)
//     import type { Foo }         →  (deleted)
//
//   NOT ERASABLE (requires code generation / transformation):
//     enum Direction { Up, Down }          → generates a runtime object
//     namespace MyNS { export const x = 1 } → generates a runtime object
//     class Foo { constructor(public x: number) {} }
//                                          → constructor param properties
//                                            generate `this.x = x` code
//
// THE FLAG — erasableSyntaxOnly:
//   Introduced in TS 5.8. Errors if you use any non-erasable TypeScript syntax.
//   Enables safe native type-stripping by runtimes.
//
// WHY IT MATTERS — native type stripping:
//   Node.js 22.6+ supports `--experimental-strip-types`.
//   Deno and Bun have supported type stripping for years.
//   When the runtime strips types, it CANNOT handle enum or namespace because:
//     - Enum generates `var Direction; Direction[Direction["Up"] = 0] = "Up"; ...`
//     - Namespace generates an IIFE wrapper
//   These require a TypeScript compiler, not a simple stripper.
//
//   If your project uses `erasableSyntaxOnly`, it can run directly under
//   Node 22+ without a build step:
//     node --experimental-strip-types src/server.ts
//
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — enums are NOT erasable ───────────────────────────────────
// Under erasableSyntaxOnly, regular enums are an error.
// TODO: Understand why and refactor to an erasable alternative.

// BEFORE (not erasable — generates runtime code):
// [ERROR with erasableSyntaxOnly: true] enum is not erasable syntax
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}

// AFTER — erasable alternatives:

// Option 1: const object + type
const DirectionValues = {
  Up: "UP",
  Down: "DOWN",
  Left: "LEFT",
  Right: "RIGHT",
} as const
type DirectionType = typeof DirectionValues[keyof typeof DirectionValues]

// Option 2: union type (simplest)
type DirectionUnion = "UP" | "DOWN" | "LEFT" | "RIGHT"

// Both options are fully erasable:
type _A1 = Expect<Equal<DirectionType, DirectionUnion>>

// ── Exercise B — const enum IS allowed ──────────────────────────────────
// const enums are inlined at use sites — no runtime object is generated.
// They ARE erasable.

const enum Status {
  Active = "active",
  Inactive = "inactive",
  Pending = "pending"
}

// Const enum members are replaced with their values at compile time:
// Status.Active → "active" (the string, inlined)
// No Status object exists at runtime

const myStatus: Status = Status.Active
type _B1 = Expect<Equal<typeof myStatus, Status>>

// ── Exercise C — namespaces with values are NOT erasable ──────────────────
// Namespace that contains values generates an IIFE wrapper.

// [ERROR with erasableSyntaxOnly: true] namespace with values is not erasable
namespace AppConfig {
  export const version = "1.0.0"
  export const maxRetries = 3
}

// AFTER — plain object (erasable):
const AppConfigObj = {
  version: "1.0.0",
  maxRetries: 3,
} as const

type _C1 = Expect<Equal<typeof AppConfigObj.version, "1.0.0">>

// Namespace with ONLY types IS erasable (no runtime code):
namespace Types {
  export type Id = string
  export type Name = string
}

type UserId = Types.Id     // string — this is fine, Types is type-only
type _C2 = Expect<Equal<UserId, string>>

// ── Exercise D — constructor parameter properties are NOT erasable ─────────
// TypeScript's `constructor(public x: number)` generates `this.x = x`.
// This is not a simple type erasure.

class WithParamProps {
  // [ERROR with erasableSyntaxOnly: true] constructor param props are not erasable
  constructor(public name: string, public age: number) {}
}

// AFTER — explicit field + assignment (erasable):
class WithExplicitFields {
  name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

type _D1 = Expect<Equal<InstanceType<typeof WithExplicitFields>["name"], string>>
type _D2 = Expect<Equal<InstanceType<typeof WithExplicitFields>["age"], number>>
