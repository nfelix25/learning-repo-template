// ─── k-047: New Set Methods (TypeScript 5.5) ─────────────────────────────────
//
// TypeScript 5.5 added types for the TC39 Set methods proposal, which shipped in
// all major engines in 2024:
//
//   set.union(other)              — all elements in either set
//   set.intersection(other)       — elements in both sets
//   set.difference(other)         — elements in set but not in other
//   set.symmetricDifference(other) — elements in exactly one of the two sets
//   set.isSubsetOf(other)         — every element of set is in other
//   set.isSupersetOf(other)       — every element of other is in set
//   set.isDisjointFrom(other)     — no elements in common
//
// All methods return NEW sets (non-mutating). The original sets are unchanged.
// These mirror mathematical set operations — Venn diagram operations made native.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest"

// ── Part 1: Set combination methods ──────────────────────────────────────────

const a = new Set([1, 2, 3, 4])
const b = new Set([3, 4, 5, 6])

describe("Set.union", () => {
  it("returns all elements from both sets", () => {
    expect([...a.union(b)].sort()).toEqual([1, 2, 3, 4, 5, 6])
  })
  it("is commutative: a.union(b) equals b.union(a)", () => {
    expect([...a.union(b)].sort()).toEqual([...b.union(a)].sort())
  })
  it("does not mutate originals", () => {
    a.union(b)
    expect([...a]).toEqual([1, 2, 3, 4])
    expect([...b]).toEqual([3, 4, 5, 6])
  })
})

describe("Set.intersection", () => {
  it("returns only shared elements", () => {
    expect([...a.intersection(b)].sort()).toEqual([3, 4])
  })
  it("returns empty set if no overlap", () => {
    const c = new Set([10, 20])
    expect(a.intersection(c).size).toBe(0)
  })
})

describe("Set.difference", () => {
  it("returns elements in a but not in b", () => {
    expect([...a.difference(b)].sort()).toEqual([1, 2])
  })
  it("is NOT commutative: a.difference(b) ≠ b.difference(a)", () => {
    expect([...b.difference(a)].sort()).toEqual([5, 6])
  })
})

describe("Set.symmetricDifference", () => {
  it("returns elements in exactly one set", () => {
    expect([...a.symmetricDifference(b)].sort()).toEqual([1, 2, 5, 6])
  })
  it("is commutative", () => {
    expect([...a.symmetricDifference(b)].sort()).toEqual([...b.symmetricDifference(a)].sort())
  })
})

// ── Part 2: Relationship methods ──────────────────────────────────────────────

const evens = new Set([2, 4, 6, 8])
const odds  = new Set([1, 3, 5, 7])
const small = new Set([2, 4])

describe("Set.isSubsetOf", () => {
  it("small is a subset of evens", () => {
    expect(small.isSubsetOf(evens)).toBe(true)
  })
  it("evens is not a subset of small", () => {
    expect(evens.isSubsetOf(small)).toBe(false)
  })
  it("a set is a subset of itself", () => {
    expect(evens.isSubsetOf(evens)).toBe(true)
  })
})

describe("Set.isSupersetOf", () => {
  it("evens is a superset of small", () => {
    expect(evens.isSupersetOf(small)).toBe(true)
  })
  it("small is not a superset of evens", () => {
    expect(small.isSupersetOf(evens)).toBe(false)
  })
})

describe("Set.isDisjointFrom", () => {
  it("evens and odds are disjoint", () => {
    expect(evens.isDisjointFrom(odds)).toBe(true)
  })
  it("evens and small are not disjoint", () => {
    expect(evens.isDisjointFrom(small)).toBe(false)
  })
})

// ── Part 3: Practical use — permission sets ───────────────────────────────────
//
// Model user permissions as sets and use set methods for access control queries.

type Permission = "read" | "write" | "admin" | "delete" | "export"

function hasAllPermissions(
  userPerms: Set<Permission>,
  required: Set<Permission>
): boolean {
  return required.isSubsetOf(userPerms)
}

function missingPermissions(
  userPerms: Set<Permission>,
  required: Set<Permission>
): Set<Permission> {
  return required.difference(userPerms)
}

describe("permission set operations", () => {
  const userPerms = new Set<Permission>(["read", "write", "export"])
  const viewReq   = new Set<Permission>(["read"])
  const editReq   = new Set<Permission>(["read", "write"])
  const adminReq  = new Set<Permission>(["read", "write", "admin", "delete"])

  it("user can view (has read)", () => {
    expect(hasAllPermissions(userPerms, viewReq)).toBe(true)
  })
  it("user can edit (has read + write)", () => {
    expect(hasAllPermissions(userPerms, editReq)).toBe(true)
  })
  it("user cannot admin (missing admin + delete)", () => {
    expect(hasAllPermissions(userPerms, adminReq)).toBe(false)
  })
  it("shows which permissions are missing", () => {
    const missing = missingPermissions(userPerms, adminReq)
    expect([...missing].sort()).toEqual(["admin", "delete"])
  })
})
