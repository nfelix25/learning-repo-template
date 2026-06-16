import { describe, it, expect, beforeEach } from 'vitest'
import { Arena } from './arena.js'

// ---------------------------------------------------------------------------
// constructor
// ---------------------------------------------------------------------------

describe('constructor', () => {
  it('capacity property equals the argument', () => {
    const a = new Arena(64)
    expect(a.capacity).toBe(64)
  })

  it('used is 0 after construction', () => {
    const a = new Arena(64)
    expect(a.used).toBe(0)
  })

  it('remaining equals capacity after construction', () => {
    const a = new Arena(64)
    expect(a.remaining).toBe(64)
  })
})

// ---------------------------------------------------------------------------
// alloc
// ---------------------------------------------------------------------------

describe('alloc', () => {
  let arena: Arena

  beforeEach(() => {
    arena = new Arena(64)
  })

  it('first alloc returns offset 0', () => {
    expect(arena.alloc(8)).toBe(0)
  })

  it('second alloc returns offset equal to first alloc size', () => {
    arena.alloc(8)
    expect(arena.alloc(8)).toBe(8)
  })

  it('used advances by allocated size', () => {
    arena.alloc(12)
    expect(arena.used).toBe(12)
    arena.alloc(4)
    expect(arena.used).toBe(16)
  })

  it('remaining decrements by allocated size', () => {
    arena.alloc(10)
    expect(arena.remaining).toBe(54)
  })

  it('returns -1 when arena is out of memory', () => {
    arena.alloc(60)
    expect(arena.alloc(8)).toBe(-1)
  })

  it('exact-fit alloc succeeds, next alloc returns -1', () => {
    arena.alloc(64)
    expect(arena.alloc(1)).toBe(-1)
  })

  it('alloc 0 bytes returns current offset and used does not change', () => {
    arena.alloc(8)
    const offsetBefore = arena.used
    const ret = arena.alloc(0)
    expect(ret).toBe(offsetBefore)
    expect(arena.used).toBe(offsetBefore)
  })

  it('multiple allocs produce non-overlapping offsets', () => {
    const o1 = arena.alloc(8)
    const o2 = arena.alloc(8)
    const o3 = arena.alloc(8)
    // Each offset must be exactly 8 apart.
    expect(o2).toBe(o1 + 8)
    expect(o3).toBe(o2 + 8)
  })
})

// ---------------------------------------------------------------------------
// writeInt32 / readInt32
// ---------------------------------------------------------------------------

describe('writeInt32 / readInt32', () => {
  it('can write and read back a positive integer', () => {
    const a = new Arena(16)
    const off = a.alloc(4)
    a.writeInt32(off, 42)
    expect(a.readInt32(off)).toBe(42)
  })

  it('can write and read back a negative integer', () => {
    const a = new Arena(16)
    const off = a.alloc(4)
    a.writeInt32(off, -99)
    expect(a.readInt32(off)).toBe(-99)
  })

  it('can write two adjacent Int32 values without interference', () => {
    const a = new Arena(16)
    const o1 = a.alloc(4)
    const o2 = a.alloc(4)
    a.writeInt32(o1, 100)
    a.writeInt32(o2, 200)
    expect(a.readInt32(o1)).toBe(100)
    expect(a.readInt32(o2)).toBe(200)
  })
})

// ---------------------------------------------------------------------------
// writeFloat64 / readFloat64
// ---------------------------------------------------------------------------

describe('writeFloat64 / readFloat64', () => {
  it('can write and read back a float', () => {
    const a = new Arena(32)
    const off = a.alloc(8)
    a.writeFloat64(off, Math.PI)
    expect(a.readFloat64(off)).toBeCloseTo(Math.PI, 10)
  })

  it('can write and read back a negative float', () => {
    const a = new Arena(32)
    const off = a.alloc(8)
    a.writeFloat64(off, -2.718281828)
    expect(a.readFloat64(off)).toBeCloseTo(-2.718281828, 9)
  })
})

// ---------------------------------------------------------------------------
// reset
// ---------------------------------------------------------------------------

describe('reset', () => {
  it('after reset, used is 0', () => {
    const a = new Arena(64)
    a.alloc(32)
    a.reset()
    expect(a.used).toBe(0)
  })

  it('after reset, remaining equals capacity', () => {
    const a = new Arena(64)
    a.alloc(32)
    a.reset()
    expect(a.remaining).toBe(64)
  })

  it('can allocate again from the start after reset', () => {
    const a = new Arena(64)
    a.alloc(32)
    a.reset()
    expect(a.alloc(8)).toBe(0)
  })

  it('write before reset does not persist after reset and re-alloc', () => {
    const a = new Arena(16)
    const off = a.alloc(4)
    a.writeInt32(off, 12345)
    a.reset()
    // After reset, the same offset can be re-used and overwritten.
    const off2 = a.alloc(4)
    a.writeInt32(off2, 999)
    expect(a.readInt32(off2)).toBe(999)
  })
})
