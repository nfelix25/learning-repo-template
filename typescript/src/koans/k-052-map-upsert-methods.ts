// ─── k-052: Map Upsert Methods (TypeScript 6.0 / ES2025) ─────────────────────
//
// TypeScript 6.0 / ES2025 adds two new Map methods that solve the common
// "get-or-insert" pattern — previously requiring awkward idioms:
//
//   // Before:
//   if (!map.has(key)) map.set(key, defaultValue)
//   const val = map.get(key)!
//
//   // Or the double-lookup:
//   map.set(key, map.get(key) ?? defaultValue)
//
// The new methods:
//   map.getOrInsert(key, defaultValue)
//     — returns existing value if present, otherwise sets AND returns defaultValue
//
//   map.getOrInsertComputed(key, () => computeDefault())
//     — like getOrInsert but the default is computed lazily (only called if missing)
//       useful when the default value is expensive to compute
//
// Both return the value (existing or newly inserted). Mutations are in-place.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest"

// Polyfill Map.prototype.getOrInsert and getOrInsertComputed for Node < 24.8
// (These are ES2025 methods not yet in all runtimes as of Node 24.11)
if (!Map.prototype.getOrInsert) {
  Map.prototype.getOrInsert = function <K, V>(this: Map<K, V>, key: K, value: V): V {
    if (this.has(key)) return this.get(key) as V
    this.set(key, value)
    return value
  }
}
if (!Map.prototype.getOrInsertComputed) {
  Map.prototype.getOrInsertComputed = function <K, V>(this: Map<K, V>, key: K, fn: (k: K) => V): V {
    if (this.has(key)) return this.get(key) as V
    const value = fn(key)
    this.set(key, value)
    return value
  }
}
if (!WeakMap.prototype.getOrInsert) {
  WeakMap.prototype.getOrInsert = function <K extends object, V>(this: WeakMap<K, V>, key: K, value: V): V {
    if (this.has(key)) return this.get(key) as V
    this.set(key, value)
    return value
  }
}

// ── Part 1: getOrInsert ───────────────────────────────────────────────────────

describe("Map.getOrInsert", () => {
  it("returns existing value when key is present", () => {
    const map = new Map([["a", 1]])
    const result = map.getOrInsert("a", 99)
    expect(result).toBe(1)
    expect(map.get("a")).toBe(1)  // unchanged
  })

  it("inserts and returns default when key is absent", () => {
    const map = new Map<string, number>()
    const result = map.getOrInsert("b", 42)
    expect(result).toBe(42)
    expect(map.get("b")).toBe(42)  // now in map
  })

  it("does not overwrite an existing value", () => {
    const map = new Map([["x", 10]])
    map.getOrInsert("x", 999)
    expect(map.get("x")).toBe(10)
  })
})

// ── Part 2: getOrInsertComputed ───────────────────────────────────────────────

describe("Map.getOrInsertComputed", () => {
  it("computes default only when key is absent", () => {
    let computeCalls = 0
    const map = new Map<string, number>()

    map.getOrInsertComputed("a", () => { computeCalls++; return 42 })
    map.getOrInsertComputed("a", () => { computeCalls++; return 99 })

    expect(computeCalls).toBe(1)      // computed only once
    expect(map.get("a")).toBe(42)     // first computed value kept
  })

  it("does not call factory when key exists", () => {
    const map = new Map([["x", 10]])
    let called = false
    map.getOrInsertComputed("x", () => { called = true; return 99 })
    expect(called).toBe(false)
    expect(map.get("x")).toBe(10)
  })
})

// ── Part 3: Practical — accumulating groups (word counter) ───────────────────
//
// Classic use: group-by or frequency-count patterns where the default is
// a new collection. Previously required hasChecks or ?? idioms.

function wordFrequency(text: string): Map<string, number> {
  const freq = new Map<string, number>()
  for (const word of text.toLowerCase().match(/\w+/g) ?? []) {
    freq.getOrInsert(word, 0)
    freq.set(word, freq.get(word)! + 1)
  }
  return freq
}

describe("wordFrequency using getOrInsert", () => {
  it("counts word occurrences", () => {
    const freq = wordFrequency("the cat sat on the mat the cat")
    expect(freq.get("the")).toBe(3)
    expect(freq.get("cat")).toBe(2)
    expect(freq.get("sat")).toBe(1)
  })
})

// ── Part 4: Practical — building adjacency lists ──────────────────────────────
//
// getOrInsertComputed shines when the default is a new collection (array/set),
// because you don't want to allocate the collection unless it's needed.

function buildAdjacencyList(edges: [string, string][]): Map<string, string[]> {
  const graph = new Map<string, string[]>()
  for (const [from, to] of edges) {
    graph.getOrInsertComputed(from, () => []).push(to)
    graph.getOrInsertComputed(to, () => [])  // ensure destination node exists
  }
  return graph
}

describe("adjacency list using getOrInsertComputed", () => {
  it("builds a directed graph", () => {
    const graph = buildAdjacencyList([
      ["a", "b"],
      ["a", "c"],
      ["b", "c"],
    ])
    expect(graph.get("a")?.sort()).toEqual(["b", "c"])
    expect(graph.get("b")).toEqual(["c"])
    expect(graph.get("c")).toEqual([])
  })
})

// ── Part 5: WeakMap.getOrInsert / WeakMap.getOrInsertComputed ─────────────────
//
// ES2025 also adds these methods to WeakMap for the same reason.
// Common use: per-object lazy initialization without explicit null checks.

describe("WeakMap.getOrInsert", () => {
  it("provides per-object cache", () => {
    const cache = new WeakMap<object, number[]>()
    const obj1 = {}
    const obj2 = {}

    cache.getOrInsert(obj1, [1, 2, 3])
    cache.getOrInsert(obj1, [99])  // should NOT overwrite

    expect(cache.get(obj1)).toEqual([1, 2, 3])
    expect(cache.get(obj2)).toBeUndefined()
  })
})
