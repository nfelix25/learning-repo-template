import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 10 — Production Decorator Patterns                  [TS 5.0/5.2]
// ─────────────────────────────────────────────────────────────────────────
// Three patterns every decorator-using codebase reaches for.
// Each one showcases WHY decorators are the right tool for that problem.
//
// PATTERN 1 — Lightweight Dependency Injection:
//   Use field decorators to inject dependencies by token.
//   A container maps tokens to values. @inject(token) reads from the container
//   and uses an initializer to override the field's initial value.
//   WHY decorators: the injection site is declarative and co-located with the
//   field definition, not buried in a constructor.
//
// PATTERN 2 — Metadata-driven Validation:
//   Use field decorators + Symbol.metadata to build a runtime validator.
//   Decorators register rules. A validate() function reads the metadata and
//   runs the rules against an instance.
//   WHY decorators: the rules live next to the fields they validate. Adding
//   a field automatically participates in validation when decorated.
//
// PATTERN 3 — Per-instance Memoization:
//   Use a method decorator + WeakMap to cache per-instance, per-call-args.
//   Unlike module-level caching (which leaks across instances), WeakMap
//   keys are garbage-collected with the instance.
//   WHY decorators: add caching to any method without modifying the method
//   body or creating boilerplate in the constructor.
// ═══════════════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════════════════
// PATTERN 1 — Dependency Injection Container
// ════════════════════════════════════════════════════════════════════════════

// Token-based container
const container = new Map<symbol, unknown>()

export function provide<T>(token: symbol, value: T): void {
  container.set(token, value)
}

// TODO: Implement the @inject(token) field decorator factory.
// It should return a field initializer that reads the token from `container`.
// If the token is not registered, throw an Error.

export function inject<T>(token: symbol) {
  return function(
    _target: undefined,
    _context: ClassFieldDecoratorContext<unknown, T>
  ): (initialValue: T) => T {
    // TODO: return initializer that reads from container
    return (v) => v  // replace this line
  }
}

// ── Usage ─────────────────────────────────────────────────────────────────

const DB_TOKEN    = Symbol("db")
const LOGGER_TOKEN = Symbol("logger")

interface Db { query(sql: string): unknown[] }
interface Logger { log(msg: string): void }

provide<Db>(DB_TOKEN, { query: (sql) => [{ sql }] })
provide<Logger>(LOGGER_TOKEN, { log: (msg) => console.log(msg) })

class UserRepository {
  @inject<Db>(DB_TOKEN)
  private db!: Db

  @inject<Logger>(LOGGER_TOKEN)
  private logger!: Logger

  findAll(): unknown[] {
    this.logger.log("findAll")
    return this.db.query("SELECT * FROM users")
  }
}

const repo = new UserRepository()
type _P1 = Expect<Equal<ReturnType<typeof repo.findAll>, unknown[]>>

// ════════════════════════════════════════════════════════════════════════════
// PATTERN 2 — Metadata-driven Validation
// ════════════════════════════════════════════════════════════════════════════

interface ValidationRule {
  field: string
  check: (value: unknown) => boolean
  message: string
}

interface ValidationMeta {
  rules?: ValidationRule[]
}

// TODO: Implement @validate(check, message) field decorator factory.
// Store each rule in (context.metadata as ValidationMeta).rules[].

export function validate(check: (value: unknown) => boolean, message: string) {
  return function(
    _target: undefined,
    context: ClassFieldDecoratorContext
  ): void {
    // TODO: push a ValidationRule into context.metadata.rules
  }
}

// TODO: Implement runValidation(instance) — reads metadata from the constructor
// and runs all rules against the instance. Returns an array of error strings.

export function runValidation(instance: object): string[] {
  const meta = (instance.constructor as { [Symbol.metadata]?: ValidationMeta })[Symbol.metadata]
  const rules = meta?.rules ?? []
  // TODO: filter rules where check(instance[rule.field]) fails, return their messages
  return []  // replace this line
}

// ── Usage ─────────────────────────────────────────────────────────────────

class CreateUserDto {
  @validate((v) => typeof v === "string" && v.length > 0, "name is required")
  @validate((v) => typeof v === "string" && v.length >= 2, "name must be at least 2 chars")
  name: string = ""

  @validate((v) => typeof v === "string" && /^[^\s@]+@[^\s@]+$/.test(v as string), "invalid email")
  email: string = ""
}

const dto = new CreateUserDto()
const errors = runValidation(dto)
type _P2 = Expect<Equal<typeof errors, string[]>>

// ════════════════════════════════════════════════════════════════════════════
// PATTERN 3 — Per-instance Memoization with WeakMap
// ════════════════════════════════════════════════════════════════════════════

// TODO: Implement @memo — per-instance memoization using a WeakMap.
// Key: JSON.stringify(args). Cache lives on the WeakMap, keyed by `this`.
// When `this` is GC'd, the cache is automatically freed.

const memoStore = new WeakMap<object, Map<string, unknown>>()

export function memo<This extends object, Args extends unknown[], Return>(
  fn: (this: This, ...args: Args) => Return,
  _context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
): (this: This, ...args: Args) => Return {
  // TODO: implement per-instance caching
  return fn  // replace this line
}

// ── Usage ─────────────────────────────────────────────────────────────────

class ReportGenerator {
  callCount = 0

  @memo
  generate(year: number, quarter: number): string {
    this.callCount++
    return `Q${quarter} ${year} Report`
  }
}

const gen1 = new ReportGenerator()
const gen2 = new ReportGenerator()

gen1.generate(2024, 1)
gen1.generate(2024, 1)  // should hit cache on gen1
gen2.generate(2024, 1)  // gen2 has its own cache — callCount starts at 0

type _P3 = Expect<Equal<ReturnType<ReportGenerator["generate"]>, string>>
