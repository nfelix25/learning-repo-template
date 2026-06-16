import type { Expect, Equal, NotEqual } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 35 — erasableSyntaxOnly + Native Type Stripping         [TS 7.0β]
// ─────────────────────────────────────────────────────────────────────────
// This lesson has a per-directory tsconfig.json with erasableSyntaxOnly: true
// Run with: tsc -p lessons/35-erasable-future-proof/tsconfig.json --noEmit
//
// You saw erasableSyntaxOnly in lesson 27. This lesson frames it in the
// context of TS 7.0 and the future of TypeScript tooling.
//
// THE NATIVE STRIPPING MOVEMENT:
//   For years, TypeScript required a build step (tsc, ts-loader, esbuild, etc.)
//   to remove TypeScript syntax before the JavaScript runtime could run it.
//
//   This is changing:
//   - Deno:      Runs .ts files natively (strips types on the fly)
//   - Bun:       Runs .ts files natively
//   - Node.js:   --experimental-strip-types (Node 22.6+)
//   - Browsers:  Stage 1 TC39 proposal for native type stripping
//
//   ALL of these use "erasable" type stripping — they delete TypeScript syntax
//   without any code transformation. They CANNOT handle:
//   - Regular enums (generate `var Foo; Foo[Foo["A"] = 0] = "A";`)
//   - Value-bearing namespaces (generate IIFEs)
//   - Constructor parameter properties (generate `this.x = x;`)
//
// WHAT TS 7.0 DOES:
//   TS 7.0's native-preview compiler (tsgo) is designed to work alongside
//   native strippers. The expectation is that for many projects:
//   1. tsgo handles type-checking (fast Go compiler)
//   2. Node.js/Deno/Bun handles execution (native strip, no build step)
//
//   With erasableSyntaxOnly: true, you get a compile-time guarantee that
//   your code can run under native stripping. No build step for execution.
//
// THE IsErasable UTILITY (illustrative):
//   We can build a type that checks if a type "looks like" it came only
//   from erasable TypeScript. This is a design aid, not a runtime check.
//   The key insight: enum member types are distinct from union string types.
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — enum to union migration ──────────────────────────────────
// Regular enum → union of string literals (erasable, also cleaner)

// NOT erasable (enum):
// [ERROR with erasableSyntaxOnly: true] enum generates runtime code
enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

// ERASABLE alternatives:
type HttpMethodUnion = "GET" | "POST" | "PUT" | "DELETE"

const HttpMethodConst = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const
type HttpMethodFromConst = typeof HttpMethodConst[keyof typeof HttpMethodConst]

// Both alternatives are equivalent at the type level:
type _A1 = Expect<Equal<HttpMethodUnion, HttpMethodFromConst>>

// Usage is nearly identical:
function makeRequest(method: HttpMethodUnion, url: string): string {
  return `${method} ${url}`
}

type _A2 = Expect<Equal<ReturnType<typeof makeRequest>, string>>

// ── Exercise B — constructor parameter properties migration ───────────────
// Constructor param properties → explicit fields (erasable)

// NOT erasable:
class OldStyle {
  // [ERROR with erasableSyntaxOnly: true] constructor param props are not erasable
  constructor(public name: string, private age: number) {}
  getAge(): number { return this.age }
}

// ERASABLE equivalent:
class NewStyle {
  name: string
  private age: number

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }

  getAge(): number { return this.age }
}

type _B1 = Expect<Equal<NewStyle["name"], string>>
type _B2 = Expect<Equal<ReturnType<NewStyle["getAge"]>, number>>

// ── Exercise C — the IsErasable illustrative utility ─────────────────────
// We can distinguish between enum types and union types at the type level.
// An enum type has members that extend the enum (nominal), while a union
// of string literals is structurally equal to string literals.

// Enum types create a named type — not just a union of strings:
// [ERROR with erasableSyntaxOnly: true] enum generates runtime code
enum Tier { Free = "free", Pro = "pro", Enterprise = "enterprise" }

// Union type — erasable:
type TierUnion = "free" | "pro" | "enterprise"

// The key difference: an enum member is assignable to the union equivalent,
// but the enum type itself is distinct from the plain union.
// At the type level, we can check structural compatibility:

// This checks if a type is a plain string union (erasable pattern):
type IsStringUnion<T> = T extends string ? (string extends T ? false : true) : false

type _C1 = Expect<Equal<IsStringUnion<TierUnion>, true>>     // union ✓
type _C2 = Expect<Equal<IsStringUnion<string>, false>>        // plain string ✗
type _C3 = Expect<Equal<IsStringUnion<"a" | "b">, true>>     // union ✓
type _C4 = Expect<Equal<IsStringUnion<number>, false>>        // not string ✗

// ── Exercise D — the no-build-step scenario ──────────────────────────────
// With erasableSyntaxOnly + Node.js 22+ --experimental-strip-types:
// Your TypeScript can run directly as:
//   node --experimental-strip-types src/server.ts
//
// Requirements for this to work:
// 1. No enum (use union or const object)
// 2. No namespace with values (use plain objects)
// 3. No constructor parameter properties (use explicit fields)
// 4. TypeScript version supporting the erasable patterns
//
// The benefit: development workflow without a build step.
// CI/production can still compile to check types, but dev runs TS directly.

type ErasableFeature =
  | "type annotations"
  | "interface"
  | "type alias"
  | "generic parameters"
  | "as casts"
  | "satisfies"
  | "import type"
  | "const enum"    // ← inlined at use sites, no runtime object

type NonErasableFeature =
  | "regular enum"
  | "namespace with values"
  | "constructor parameter properties"
  | "decorators"    // ← decorators still generate runtime code (lessson 05-10)

// Note: decorators are also non-erasable! Keep this in mind if using
// erasableSyntaxOnly — decorator usage is incompatible with it.
const _note: NonErasableFeature = "decorators"

type _D1 = Expect<Equal<ErasableFeature, ErasableFeature>>  // compiles ✓
