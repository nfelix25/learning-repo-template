import { describe, it, expect, beforeEach } from 'vitest'
import { DisjointSet } from './disjoint-set.js'

// ---------------------------------------------------------------------------
// constructor
// ---------------------------------------------------------------------------

describe('constructor', () => {
  it('creates n singletons — each element is its own root', () => {
    const ds = new DisjointSet(5)
    for (let i = 0; i < 5; i++) {
      expect(ds.find(i)).toBe(i)
    }
  })

  it('componentCount equals n immediately after construction', () => {
    const ds = new DisjointSet(6)
    expect(ds.componentCount()).toBe(6)
  })

  it('size property reflects the argument', () => {
    expect(new DisjointSet(10).size).toBe(10)
  })
})

// ---------------------------------------------------------------------------
// find
// ---------------------------------------------------------------------------

describe('find', () => {
  it('find(x) === x initially for all x', () => {
    const ds = new DisjointSet(4)
    for (let i = 0; i < 4; i++) {
      expect(ds.find(i)).toBe(i)
    }
  })

  it('after union(0,1), find(0) === find(1)', () => {
    const ds = new DisjointSet(3)
    ds.union(0, 1)
    expect(ds.find(0)).toBe(ds.find(1))
  })

  it('find returns a valid root (find(find(x)) === find(x))', () => {
    const ds = new DisjointSet(4)
    ds.union(0, 1)
    ds.union(1, 2)
    const root = ds.find(2)
    expect(ds.find(root)).toBe(root)
  })
})

// ---------------------------------------------------------------------------
// union
// ---------------------------------------------------------------------------

describe('union', () => {
  it('returns true when merging two different sets', () => {
    const ds = new DisjointSet(3)
    expect(ds.union(0, 1)).toBe(true)
  })

  it('returns false when elements are already in the same set', () => {
    const ds = new DisjointSet(3)
    ds.union(0, 1)
    expect(ds.union(0, 1)).toBe(false)
  })

  it('returns false when union(x, x) is called', () => {
    const ds = new DisjointSet(3)
    expect(ds.union(2, 2)).toBe(false)
  })

  it('merges sets transitively: union(0,1) + union(1,2) gives same root for all three', () => {
    const ds = new DisjointSet(4)
    ds.union(0, 1)
    ds.union(1, 2)
    expect(ds.find(0)).toBe(ds.find(1))
    expect(ds.find(1)).toBe(ds.find(2))
  })

  it('elements not involved in union retain their own root', () => {
    const ds = new DisjointSet(4)
    ds.union(0, 1)
    expect(ds.find(2)).toBe(2)
    expect(ds.find(3)).toBe(3)
  })
})

// ---------------------------------------------------------------------------
// connected
// ---------------------------------------------------------------------------

describe('connected', () => {
  it('connected(x, y) is false when x and y are disjoint', () => {
    const ds = new DisjointSet(3)
    expect(ds.connected(0, 1)).toBe(false)
  })

  it('connected(x, x) is true', () => {
    const ds = new DisjointSet(3)
    expect(ds.connected(2, 2)).toBe(true)
  })

  it('connected(x, y) is true after union(x, y)', () => {
    const ds = new DisjointSet(4)
    ds.union(1, 3)
    expect(ds.connected(1, 3)).toBe(true)
  })

  it('connected(x, z) is true after transitive unions', () => {
    const ds = new DisjointSet(4)
    ds.union(0, 1)
    ds.union(1, 2)
    expect(ds.connected(0, 2)).toBe(true)
  })

  it('connected is symmetric', () => {
    const ds = new DisjointSet(4)
    ds.union(0, 1)
    expect(ds.connected(0, 1)).toBe(ds.connected(1, 0))
  })
})

// ---------------------------------------------------------------------------
// componentCount
// ---------------------------------------------------------------------------

describe('componentCount', () => {
  let ds: DisjointSet

  beforeEach(() => {
    ds = new DisjointSet(5)
  })

  it('starts at n', () => {
    expect(ds.componentCount()).toBe(5)
  })

  it('decrements by 1 on each successful union', () => {
    ds.union(0, 1)
    expect(ds.componentCount()).toBe(4)
    ds.union(2, 3)
    expect(ds.componentCount()).toBe(3)
    ds.union(0, 2)
    expect(ds.componentCount()).toBe(2)
  })

  it('does NOT decrement when union is called on the same set', () => {
    ds.union(0, 1)
    const before = ds.componentCount()
    ds.union(0, 1)
    expect(ds.componentCount()).toBe(before)
  })

  it('reaches 1 after unioning all elements', () => {
    for (let i = 1; i < 5; i++) ds.union(0, i)
    expect(ds.componentCount()).toBe(1)
  })
})

// ---------------------------------------------------------------------------
// Path compression (indirect verification)
// ---------------------------------------------------------------------------

describe('path compression', () => {
  it('find is consistent after a chain of unions (path compression does not break find)', () => {
    // Build a long chain: 0-1-2-3-4 then verify all resolve to the same root.
    const ds = new DisjointSet(5)
    ds.union(0, 1)
    ds.union(1, 2)
    ds.union(2, 3)
    ds.union(3, 4)
    const root = ds.find(0)
    for (let i = 1; i < 5; i++) {
      expect(ds.find(i)).toBe(root)
    }
  })
})

// ---------------------------------------------------------------------------
// Union by rank (indirect verification)
// ---------------------------------------------------------------------------

describe('union by rank', () => {
  it('higher-rank root stays root: find results remain valid after rank-based merges', () => {
    // Union 0-1-2 to build rank-2 root, then union with singleton 3.
    const ds = new DisjointSet(4)
    ds.union(0, 1) // rank[0 or 1] becomes 1
    ds.union(0, 2) // attaches under the rank-1 root
    ds.union(0, 3)
    // All four should share one component
    const root = ds.find(0)
    expect(ds.find(1)).toBe(root)
    expect(ds.find(2)).toBe(root)
    expect(ds.find(3)).toBe(root)
  })
})

// ---------------------------------------------------------------------------
// Large n
// ---------------------------------------------------------------------------

describe('large n', () => {
  it('1000-element set: union into one component', () => {
    const n = 1000
    const ds = new DisjointSet(n)
    for (let i = 1; i < n; i++) ds.union(0, i)
    expect(ds.componentCount()).toBe(1)
  })

  it('1000-element set: all elements share the same root', () => {
    const n = 1000
    const ds = new DisjointSet(n)
    for (let i = 1; i < n; i++) ds.union(0, i)
    const root = ds.find(0)
    for (let i = 1; i < n; i++) {
      expect(ds.find(i)).toBe(root)
    }
  })
})
