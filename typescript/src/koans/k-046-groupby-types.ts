// ─── k-046: Object.groupBy and Map.groupBy (TypeScript 5.4) ──────────────────
//
// TypeScript 5.4 added types for the TC39 `Object.groupBy` and `Map.groupBy`
// static methods (which shipped in V8/SpiderMonkey in 2024).
//
// These replace the common reduce-to-object idiom:
//
//   // before
//   const groups = arr.reduce((acc, item) => {
//     const key = getKey(item)
//     ;(acc[key] ??= []).push(item)
//     return acc
//   }, {} as Record<string, Item[]>)
//
//   // after
//   const groups = Object.groupBy(arr, item => getKey(item))
//
// Key type detail: `Object.groupBy` returns `Partial<Record<Key, Item[]>>` —
// NOT `Record<Key, Item[]>`. This is deliberate: the group for a key might not
// exist if no elements map to it, so TypeScript forces you to handle undefined.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest"
import type { Expect, Equal } from "../utils/type-utils.js"

// ── Part 1: Object.groupBy basics ────────────────────────────────────────────

type Product = { name: string; category: string; price: number }

const products: Product[] = [
  { name: "apple",  category: "fruit",  price: 1 },
  { name: "banana", category: "fruit",  price: 0.5 },
  { name: "carrot", category: "veggie", price: 0.8 },
  { name: "daikon", category: "veggie", price: 1.2 },
  { name: "egg",    category: "dairy",  price: 3 },
]

// Returns Partial<Record<string, Product[]>>
const byCategory = Object.groupBy(products, p => p.category)

type _1a = Expect<Equal<typeof byCategory, Partial<Record<string, Product[]>>>>

describe("Object.groupBy", () => {
  it("groups products by category", () => {
    expect(byCategory["fruit"]?.length).toBe(2)
    expect(byCategory["veggie"]?.length).toBe(2)
    expect(byCategory["dairy"]?.length).toBe(1)
  })

  it("returns undefined for unknown keys (Partial)", () => {
    expect(byCategory["meat"]).toBeUndefined()
  })

  it("preserves item order within groups", () => {
    expect(byCategory["fruit"]?.map(p => p.name)).toEqual(["apple", "banana"])
  })
})

// ── Part 2: Map.groupBy ───────────────────────────────────────────────────────
//
// `Map.groupBy` is like `Object.groupBy` but returns a `Map<Key, Item[]>`.
// The key type can be anything (not just string/symbol), and Map guarantees
// existence of keys — it returns `Map<Key, Item[]>`, not Partial.

type Person = { name: string; age: number }
const people: Person[] = [
  { name: "Alice", age: 30 },
  { name: "Bob",   age: 25 },
  { name: "Carol", age: 30 },
  { name: "Dave",  age: 25 },
]

const byAge = Map.groupBy(people, p => p.age)

type _2a = Expect<Equal<typeof byAge, Map<number, Person[]>>>

describe("Map.groupBy", () => {
  it("groups by numeric key", () => {
    expect(byAge.get(30)?.map(p => p.name)).toEqual(["Alice", "Carol"])
    expect(byAge.get(25)?.map(p => p.name)).toEqual(["Bob", "Dave"])
  })

  it("returns a Map (not a plain object)", () => {
    expect(byAge instanceof Map).toBe(true)
  })

  it("missing key returns undefined from Map.get", () => {
    expect(byAge.get(99)).toBeUndefined()
  })
})

// ── Part 3: Grouping with a boolean key ───────────────────────────────────────
//
// A common use: partition into two groups — pass/fail, above/below threshold.

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const partitioned = Object.groupBy(numbers, n => n % 2 === 0 ? "even" : "odd")

type _3a = Expect<Equal<typeof partitioned, Partial<Record<string, number[]>>>>

describe("Object.groupBy with boolean-style key", () => {
  it("partitions into even and odd", () => {
    expect(partitioned["even"]).toEqual([2, 4, 6, 8, 10])
    expect(partitioned["odd"]).toEqual([1, 3, 5, 7, 9])
  })
})

// ── Part 4: Handling Partial — safe access patterns ───────────────────────────
//
// Because Object.groupBy returns Partial, you must handle undefined.
// Demonstrate safe access with ?. and ?? default.

function countInGroup(
  groups: Partial<Record<string, unknown[]>>,
  key: string
): number {
  return groups[key]?.length ?? 0
}

describe("safe access on Partial groupBy result", () => {
  it("returns count for existing group", () => {
    expect(countInGroup(byCategory, "fruit")).toBe(2)
  })
  it("returns 0 for missing group", () => {
    expect(countInGroup(byCategory, "spice")).toBe(0)
  })
})
