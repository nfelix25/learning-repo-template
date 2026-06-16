import { describe, it, expect, beforeEach } from 'vitest'
import { Arena } from './arena.js'
import { ArenaLinkedList, NODE_SIZE, NULL_PTR } from './arena-linked-list.js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create an arena large enough for `n` nodes. */
function arenaFor(n: number): Arena {
  return new Arena(n * NODE_SIZE)
}

// ---------------------------------------------------------------------------
// constructor
// ---------------------------------------------------------------------------

describe('constructor', () => {
  it('empty list: length is 0', () => {
    const list = new ArenaLinkedList(arenaFor(4))
    expect(list.length).toBe(0)
  })

  it('empty list: toArray is []', () => {
    const list = new ArenaLinkedList(arenaFor(4))
    expect(list.toArray()).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// prepend
// ---------------------------------------------------------------------------

describe('prepend', () => {
  let list: ArenaLinkedList

  beforeEach(() => {
    list = new ArenaLinkedList(arenaFor(4))
  })

  it('prepend adds to front — single element', () => {
    list.prepend(10)
    expect(list.toArray()).toEqual([10])
  })

  it('prepend adds to front — two elements', () => {
    list.prepend(10)
    list.prepend(20)
    expect(list.toArray()).toEqual([20, 10])
  })

  it('prepend increments length', () => {
    list.prepend(1)
    expect(list.length).toBe(1)
    list.prepend(2)
    expect(list.length).toBe(2)
  })

  it('prepend returns true when arena has space', () => {
    expect(list.prepend(42)).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// append
// ---------------------------------------------------------------------------

describe('append', () => {
  let list: ArenaLinkedList

  beforeEach(() => {
    list = new ArenaLinkedList(arenaFor(4))
  })

  it('append adds to back — single element', () => {
    list.append(10)
    expect(list.toArray()).toEqual([10])
  })

  it('append adds to back — two elements', () => {
    list.append(10)
    list.append(20)
    expect(list.toArray()).toEqual([10, 20])
  })

  it('append increments length', () => {
    list.append(1)
    expect(list.length).toBe(1)
    list.append(2)
    expect(list.length).toBe(2)
  })

  it('append returns true when arena has space', () => {
    expect(list.append(99)).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// shift
// ---------------------------------------------------------------------------

describe('shift', () => {
  it('removes and returns head value', () => {
    const list = new ArenaLinkedList(arenaFor(3))
    list.append(1)
    list.append(2)
    list.append(3)
    expect(list.shift()).toBe(1)
  })

  it('length decrements after shift', () => {
    const list = new ArenaLinkedList(arenaFor(3))
    list.append(10)
    list.append(20)
    list.shift()
    expect(list.length).toBe(1)
  })

  it('toArray reflects removal', () => {
    const list = new ArenaLinkedList(arenaFor(3))
    list.append(1)
    list.append(2)
    list.append(3)
    list.shift()
    expect(list.toArray()).toEqual([2, 3])
  })

  it('shift on empty list returns null', () => {
    const list = new ArenaLinkedList(arenaFor(4))
    expect(list.shift()).toBeNull()
  })

  it('shift after last element leaves length 0', () => {
    const list = new ArenaLinkedList(arenaFor(2))
    list.append(5)
    list.shift()
    expect(list.length).toBe(0)
    expect(list.toArray()).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// mixed prepend / append
// ---------------------------------------------------------------------------

describe('mixed prepend and append', () => {
  it('interleaved prepend/append produces correct order', () => {
    const list = new ArenaLinkedList(arenaFor(5))
    list.append(2)    // [2]
    list.prepend(1)   // [1, 2]
    list.append(3)    // [1, 2, 3]
    list.prepend(0)   // [0, 1, 2, 3]
    expect(list.toArray()).toEqual([0, 1, 2, 3])
  })

  it('length is correct after mixed operations', () => {
    const list = new ArenaLinkedList(arenaFor(5))
    list.append(1)
    list.prepend(0)
    list.append(2)
    expect(list.length).toBe(3)
  })
})

// ---------------------------------------------------------------------------
// Full arena
// ---------------------------------------------------------------------------

describe('full arena', () => {
  it('prepend returns false when arena is exhausted', () => {
    const list = new ArenaLinkedList(arenaFor(1))
    list.prepend(10)               // fills the only slot
    expect(list.prepend(20)).toBe(false)
  })

  it('append returns false when arena is exhausted', () => {
    const list = new ArenaLinkedList(arenaFor(1))
    list.append(10)
    expect(list.append(20)).toBe(false)
  })

  it('list is intact when append fails due to OOM', () => {
    const list = new ArenaLinkedList(arenaFor(2))
    list.append(1)
    list.append(2)
    list.append(999) // should fail silently (return false)
    expect(list.toArray()).toEqual([1, 2])
  })
})

// ---------------------------------------------------------------------------
// NULL_PTR export
// ---------------------------------------------------------------------------

describe('NULL_PTR constant', () => {
  it('NULL_PTR is -1', () => {
    expect(NULL_PTR).toBe(-1)
  })
})

// ---------------------------------------------------------------------------
// Multiple lists sharing one arena
// ---------------------------------------------------------------------------

describe('multiple lists sharing one arena', () => {
  it('second list nodes occupy different offsets than first list', () => {
    // Arena large enough for 4 nodes total.
    const arena = arenaFor(4)
    const list1 = new ArenaLinkedList(arena)
    const list2 = new ArenaLinkedList(arena)

    list1.append(10)
    list1.append(20)
    list2.append(30)
    list2.append(40)

    // Both lists should have their own values.
    expect(list1.toArray()).toEqual([10, 20])
    expect(list2.toArray()).toEqual([30, 40])
  })

  it('arena.used equals total nodes × NODE_SIZE after two lists allocate', () => {
    const arena = arenaFor(4)
    const list1 = new ArenaLinkedList(arena)
    const list2 = new ArenaLinkedList(arena)
    list1.append(1)
    list2.append(2)
    expect(arena.used).toBe(2 * NODE_SIZE)
  })
})
