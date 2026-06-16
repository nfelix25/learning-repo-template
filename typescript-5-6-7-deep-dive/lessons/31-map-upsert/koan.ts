import type { Expect, Equal } from "../../src/utils.ts"

// ═══════════════════════════════════════════════════════════════════════════
// LESSON 31 — Map/WeakMap Upsert Methods                         [TS 6.0]
// ─────────────────────────────────────────────────────────────────────────
// NEW METHODS (TC39 stage 4, types in TS 6.0 lib: esnext):
//   Map.prototype.getOrInsert(key, defaultValue)
//   Map.prototype.getOrInsertComputed(key, () => defaultValue)
//   WeakMap.prototype.getOrInsert(key, defaultValue)
//   WeakMap.prototype.getOrInsertComputed(key, () => defaultValue)
//
// THE PATTERN THEY REPLACE:
//   The "get or create" pattern was verbose and error-prone:
//
//     // Before:
//     if (!map.has(key)) {
//       map.set(key, computeDefault())
//     }
//     const value = map.get(key)!  // non-null assertion required
//
//     // Or the slightly shorter but still awkward:
//     const value = map.get(key) ?? (map.set(key, defaultValue), defaultValue)
//
//   Both patterns are verbose and the `??=` approach loses type safety.
//
// getOrInsert(key, defaultValue):
//   Returns the existing value if the key exists.
//   If not, sets the key to defaultValue and returns defaultValue.
//   The defaultValue is evaluated EAGERLY — always computed, even if unused.
//
// getOrInsertComputed(key, factory):
//   Like getOrInsert but the factory is called LAZILY — only when the key
//   is missing. Use this when computing the default is expensive.
//
// RETURN TYPE:
//   Both methods return the value type (not V | undefined).
//   This is the key benefit: no `!` assertion or `?? throw` needed.
//
// WeakMap support:
//   Same two methods on WeakMap, with the same object key constraint.
// ═══════════════════════════════════════════════════════════════════════════

// ── Exercise A — getOrInsert ──────────────────────────────────────────────

const cache = new Map<string, number>()

// OLD PATTERN (verbose):
function getOrSetOld(key: string, defaultVal: number): number {
  if (!cache.has(key)) cache.set(key, defaultVal)
  return cache.get(key)!  // non-null assertion
}

// TODO: Rewrite using getOrInsert.
function getOrSetNew(key: string, defaultVal: number): number {
  // TODO: return cache.getOrInsert(key, defaultVal)
  return getOrSetOld(key, defaultVal)  // replace this line
}

const _v1 = getOrSetNew("score", 0)
type _A1 = Expect<Equal<typeof _v1, number>>  // should be number, not number | undefined

// ── Exercise B — getOrInsertComputed ─────────────────────────────────────
// Use this when the default value is expensive to compute.

const userCache = new Map<number, { name: string; roles: string[] }>()

function getOrCreateUser(id: number): { name: string; roles: string[] } {
  // OLD:
  // if (!userCache.has(id)) {
  //   userCache.set(id, { name: `User_${id}`, roles: [] })  // expensive DB call in reality
  // }
  // return userCache.get(id)!

  // TODO: use getOrInsertComputed with a factory function
  return userCache.getOrInsertComputed(id, () => ({
    name: `User_${id}`,
    roles: [],
  }))
}

const _user = getOrCreateUser(42)
type _B1 = Expect<Equal<typeof _user, { name: string; roles: string[] }>>

// ── Exercise C — WeakMap version ─────────────────────────────────────────
// Same methods on WeakMap — useful for per-instance caches.

const instanceCache = new WeakMap<object, Map<string, unknown>>()

function getInstanceCache(instance: object): Map<string, unknown> {
  // TODO: use instanceCache.getOrInsertComputed(instance, () => new Map())
  return instanceCache.getOrInsertComputed(instance, () => new Map<string, unknown>())
}

const obj = {}
const cache1 = getInstanceCache(obj)
const cache2 = getInstanceCache(obj)  // same instance — should return same Map

type _C1 = Expect<Equal<typeof cache1, Map<string, unknown>>>

// ── Exercise D — eager vs lazy: when it matters ───────────────────────────
// getOrInsert evaluates the default immediately.
// getOrInsertComputed evaluates lazily.

const callLog: string[] = []

function expensiveDefault(): string {
  callLog.push("computed!")
  return "expensive-value"
}

const m = new Map<string, string>()
m.set("exists", "existing-value")

// getOrInsert — always calls expensiveDefault():
m.getOrInsert("exists", expensiveDefault())  // expensiveDefault() is called BEFORE getOrInsert
// callLog: ["computed!"] even though "exists" key was present

// getOrInsertComputed — only calls factory when key is missing:
m.getOrInsertComputed("exists", expensiveDefault)  // factory NOT called (key exists)
// callLog: still ["computed!"] — no second call

m.getOrInsertComputed("new-key", expensiveDefault)  // factory called (key missing)
// callLog: ["computed!", "computed!"]

type _D1 = Expect<Equal<typeof callLog, string[]>>

// ── Exercise E — return type comparison ──────────────────────────────────
// The old pattern required `!` or `?? defaultValue`.
// The new methods return V (not V | undefined) — no assertion needed.

const typedMap = new Map<string, number[]>()

// OLD: map.get() returns V | undefined
const old_get = typedMap.get("key")
type _E1 = Expect<Equal<typeof old_get, number[] | undefined>>  // V | undefined

// NEW: getOrInsert returns V
const new_get = typedMap.getOrInsert("key", [])
type _E2 = Expect<Equal<typeof new_get, number[]>>  // V, not V | undefined
