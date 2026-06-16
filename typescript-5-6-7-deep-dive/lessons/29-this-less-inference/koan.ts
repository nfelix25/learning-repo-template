import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 29 — this-less Function Inference                       [TS 6.0]
// ─────────────────────────────────────────────────────────────────────────
// BACKGROUND — contextual sensitivity:
//   A function is "contextually sensitive" if its type depends on `this`.
//   For example, a method in an object literal can reference `this` to
//   access sibling properties. TypeScript must know the `this` type to
//   type-check such methods.
//
//   This created a problem for GENERIC functions: if a method was
//   contextually sensitive, TypeScript was more conservative about using
//   it to infer a type argument. The order of properties in an object
//   literal could affect whether inference succeeded.
//
// THE CHANGE (TS 6.0):
//   Functions that do NOT use `this` are no longer treated as contextually
//   sensitive. TypeScript can freely use them for type argument inference
//   regardless of their position in an object literal.
//
// PRACTICAL IMPACT:
//   Code that previously required an explicit type annotation (to help TS
//   infer the right generic) may now infer correctly without the annotation.
//
// BEFORE TS 6.0 (order-dependent inference):
//   type Handler<T> = { process: (data: T) => string; name: string }
//   function makeHandler<T>(h: Handler<T>): Handler<T> { return h }
//
//   // This might infer T differently depending on property order:
//   const h1 = makeHandler({ name: "x", process: (d) => String(d) })
//   const h2 = makeHandler({ process: (d) => String(d), name: "x" })
//
// AFTER TS 6.0:
//   Both orderings produce the same inference because `process` (no `this`)
//   no longer blocks inference regardless of position.
//
// NOTE:
//   If the method DOES use `this`, contextual sensitivity still applies.
//   This change only benefits functions/methods that don't reference `this`.
// ═══════════════════════════════════════════════════════════════════════════

// ── Setup ─────────────────────────────────────────────────────────────────

interface Processor<T> {
  name: string
  process: (data: T) => string
  validate?: (data: T) => boolean
}

function defineProcessor<T>(p: Processor<T>): Processor<T> {
  return p
}

// ── Exercise A — inference regardless of property order ───────────────────
// In TS 6.0+, these two should infer the same type for T.
// The `process` method doesn't use `this`, so order doesn't matter.

// name first, then process:
const p1 = defineProcessor({
  name: "number-processor",
  process: (data) => String(data),  // T inferred from data usage
})

// process first, then name:
const p2 = defineProcessor({
  process: (data) => String(data),
  name: "number-processor",
})

// Both should infer as Processor<string> if no usage of data is typed.
// Without explicit typing, they infer from context. Let's test with typed input:

const p3 = defineProcessor({
  name: "typed",
  process: (data: number) => data.toFixed(2),  // explicit: T = number
})

type _A1 = Expect<Equal<typeof p3, Processor<number>>>

// ── Exercise B — methods WITH this still have contextual sensitivity ───────
// If a method uses `this`, TS 6.0 does NOT remove contextual sensitivity.
// This is the "gotcha" — the change only applies to this-less functions.

interface Counter<T> {
  items: T[]
  count(): number  // uses `this` implicitly via the method signature
}

// This requires TypeScript to know the `this` type to check `this.items`:
function makeCounter<T>(c: Counter<T>): Counter<T> { return c }

const counter = makeCounter({
  items: [1, 2, 3],
  count() { return this.items.length },  // `this` used here
})

type _B1 = Expect<Equal<typeof counter.items, number[]>>

// ── Exercise C — generic constraint inference ────────────────────────────
// A real-world case where this-less inference helps.

function mapConfig<T extends Record<string, unknown>>(
  config: T,
  transform: (key: keyof T, value: T[keyof T]) => string
): Record<keyof T, string> {
  const result = {} as Record<keyof T, string>
  for (const key in config) {
    result[key] = transform(key, config[key])
  }
  return result
}

const dbConfig = { host: "localhost", port: 3000, debug: false } as const

// In TS 6.0, `transform` doesn't use `this`, so T can be inferred from `config`
// without the order of arguments mattering:
const formatted = mapConfig(dbConfig, (key, value) => `${String(key)}=${String(value)}`)

type _C1 = Expect<Equal<
  typeof formatted,
  Record<"host" | "port" | "debug", string>
>>
