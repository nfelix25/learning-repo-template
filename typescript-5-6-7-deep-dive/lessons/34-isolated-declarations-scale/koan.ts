import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 34 — isolatedDeclarations at Scale                     [TS 7.0β]
// ─────────────────────────────────────────────────────────────────────────
// This lesson has a per-directory tsconfig.json with isolatedDeclarations: true
// Run with: tsc -p lessons/34-isolated-declarations-scale/tsconfig.json --noEmit
//
// You saw isolatedDeclarations in lesson 20. This lesson goes deeper —
// specifically why it matters for TS 7.0's parallel architecture.
//
// THE DECLARATION EMIT BOTTLENECK:
//   A .d.ts file describes the PUBLIC API of a module.
//   To generate a .d.ts, TypeScript needs to know the types of all exports.
//   For: `export const x = computeType<SomeImport>()`, TypeScript must:
//     1. Resolve `SomeImport` (reads another file)
//     2. Evaluate `computeType<SomeImport>` (may chain through many types)
//   This is cross-file work. Sequential. Bottlenecks parallel emit.
//
// THE ISOLATED DECLARATIONS CONTRACT:
//   With --isolatedDeclarations, TypeScript checks that every exported
//   value can be annotated WITHOUT looking at other files.
//   If every file satisfies this constraint, .d.ts files can be emitted
//   in parallel by multiple workers — each worker sees only its own file.
//
//   TS 7.0's Go compiler uses this to spin up N type-checker workers.
//   Each worker independently emits the .d.ts for its assigned files.
//   Result: declaration emit for 1000 files takes 1/N of the sequential time.
//
// DESIGN DISCIPLINE:
//   Rather than viewing isolatedDeclarations as "add more annotations",
//   think of it as "make your API explicit."
//   Well-designed modules SHOULD have explicit types on their exports.
//   isolatedDeclarations just enforces what good API design already requires.
//
// WHICH PATTERNS REQUIRE ANNOTATION:
//   ✗ export function foo() { return bar() }        // bar's return type unknown
//   ✓ export function foo(): BarReturnType { ... }
//
//   ✗ export const config = buildConfig(defaults)   // buildConfig return type unknown
//   ✓ export const config: Config = buildConfig(defaults)
//
//   ✗ export default class extends BaseClass { }    // extending needs annotation
//   ✓ export default class MyClass extends BaseClass implements IFace { }
//
// WHICH PATTERNS DON'T NEED ANNOTATION:
//   ✓ export const API_URL = "https://api.example.com"   // literal
//   ✓ export const MAX = 100 as const                    // literal assertion
//   ✓ export type Foo = { x: string }                    // type alias, trivial
//   ✓ export interface Bar { y: number }                 // interface, trivial
// ═══════════════════════════════════════════════════════════════════════════

// ── Setup: types for the exercises ───────────────────────────────────────

export interface User { id: number; name: string; email: string }
export interface Post { id: number; title: string; authorId: number }
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

// ── Exercise A — annotate exported functions ──────────────────────────────
// TODO: Add explicit return type annotations so these satisfy isolatedDeclarations.
// With the per-directory tsconfig, running tsc will show which are missing.

export function createUser(name: string, email: string) {
  // TODO: add return type annotation
  return { id: Math.random(), name, email }
}

export function getUsers(page: number, pageSize: number) {
  // TODO: add return type annotation
  return {
    data: [] as User[],
    total: 0,
    page,
    pageSize,
  }
}

export async function fetchPost(id: number) {
  // TODO: add return type annotation
  return { id, title: "Hello", authorId: 1 }
}

// After your fix:
type _A1 = Expect<Equal<ReturnType<typeof createUser>, User>>
type _A2 = Expect<Equal<ReturnType<typeof getUsers>, PaginatedResponse<User>>>
type _A3 = Expect<Equal<ReturnType<typeof fetchPost>, Promise<Post>>>

// ── Exercise B — trivially inferrable exports (no annotation needed) ───────
// These are already fine under isolatedDeclarations:

export const API_VERSION = "v2" as const         // literal ✓
export const MAX_PAGE_SIZE = 100                  // numeric literal ✓
export const SUPPORTED_FORMATS = ["json", "csv"] as const  // literal array ✓
export type ApiError = { code: number; message: string }   // type alias ✓

type _B1 = Expect<Equal<typeof API_VERSION, "v2">>
type _B2 = Expect<Equal<typeof MAX_PAGE_SIZE, 100>>

// ── Exercise C — class export with explicit implements ────────────────────
// Class exports are fine if they don't extend types that require cross-file resolution.
// TODO: Add explicit return types to the methods below.

export interface Repository<T> {
  findById(id: number): Promise<T>
  findAll(): Promise<T[]>
  save(entity: T): Promise<T>
}

export class UserRepository implements Repository<User> {
  async findById(id: number) {
    // TODO: add return type annotation
    return { id, name: "Alice", email: "alice@example.com" }
  }

  async findAll() {
    // TODO: add return type annotation
    return [] as User[]
  }

  async save(user: User) {
    // TODO: add return type annotation
    return user
  }
}

type _C1 = Expect<Equal<ReturnType<UserRepository["findById"]>, Promise<User>>>

// ── Exercise D — the parallelism benefit in numbers ──────────────────────
// This is a mental model exercise. No type-level test.

// Sequential declaration emit (no isolatedDeclarations):
//   100 files × 50ms per file (with cross-file resolution) = 5000ms

// Parallel declaration emit (with isolatedDeclarations + tsgo --checkers 4):
//   100 files / 4 workers × 50ms per file = 1250ms

// The gain is linear with the number of workers, up to the file count.
// Large codebases benefit most.

const model = {
  files: 100,
  msPerFile: 50,
  workers: 4,
  sequentialMs: 100 * 50,
  parallelMs: (100 / 4) * 50,
} as const

type _D1 = Expect<Equal<typeof model.sequentialMs, 5000>>
type _D2 = Expect<Equal<typeof model.parallelMs, 1250>>
