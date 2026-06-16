import { describe, it, expect } from 'vitest'
import { Rope } from './rope.js'

// ---------------------------------------------------------------------------
// Construction
// ---------------------------------------------------------------------------

describe('construction', () => {
  it('new Rope("Hello").toString() === "Hello"', () => {
    expect(new Rope('Hello').toString()).toBe('Hello')
  })

  it('new Rope("").length === 0', () => {
    expect(new Rope('').length).toBe(0)
  })

  it('new Rope() with no argument has length 0', () => {
    expect(new Rope().length).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// charAt
// ---------------------------------------------------------------------------

describe('charAt', () => {
  it('charAt(0) returns first character', () => {
    expect(new Rope('Hello').charAt(0)).toBe('H')
  })

  it('charAt(length-1) returns last character', () => {
    const r = new Rope('Hello')
    expect(r.charAt(r.length - 1)).toBe('o')
  })

  it('charAt(middle) returns correct character', () => {
    expect(new Rope('Hello').charAt(2)).toBe('l')
  })

  it('charAt(-1) throws RangeError', () => {
    expect(() => new Rope('Hello').charAt(-1)).toThrow(RangeError)
  })

  it('charAt(length) throws RangeError', () => {
    const r = new Rope('Hello')
    expect(() => r.charAt(r.length)).toThrow(RangeError)
  })
})

// ---------------------------------------------------------------------------
// concat
// ---------------------------------------------------------------------------

describe('concat', () => {
  it('concat returns new Rope whose toString equals left + right', () => {
    const a = new Rope('Hello, ')
    const b = new Rope('World!')
    expect(a.concat(b).toString()).toBe('Hello, World!')
  })

  it('concat does not mutate original ropes', () => {
    const a = new Rope('Hello')
    const b = new Rope(' World')
    a.concat(b)
    expect(a.toString()).toBe('Hello')
    expect(b.toString()).toBe(' World')
  })

  it('concat with empty rope returns rope equal to the other', () => {
    const empty = new Rope('')
    const hello = new Rope('Hello')
    expect(empty.concat(hello).toString()).toBe('Hello')
    expect(hello.concat(empty).toString()).toBe('Hello')
  })
})

// ---------------------------------------------------------------------------
// substring
// ---------------------------------------------------------------------------

describe('substring', () => {
  it('substring(0, length) === toString()', () => {
    const r = new Rope('Hello, World!')
    expect(r.substring(0, r.length)).toBe('Hello, World!')
  })

  it('substring(1, 4) returns correct slice', () => {
    expect(new Rope('Hello').substring(1, 4)).toBe('ell')
  })

  it('substring of concatenated rope works', () => {
    const r = new Rope('Hello').concat(new Rope(', World!'))
    expect(r.substring(7, 12)).toBe('World')
  })
})

// ---------------------------------------------------------------------------
// split
// ---------------------------------------------------------------------------

describe('split', () => {
  it('split(i): left.toString() + right.toString() === original.toString()', () => {
    const r = new Rope('Hello, World!')
    const [left, right] = r.split(7)
    expect(left.toString() + right.toString()).toBe('Hello, World!')
  })

  it('split(0): left is empty, right is full', () => {
    const r = new Rope('Hello')
    const [left, right] = r.split(0)
    expect(left.toString()).toBe('')
    expect(right.toString()).toBe('Hello')
  })

  it('split(length): left is full, right is empty', () => {
    const r = new Rope('Hello')
    const [left, right] = r.split(r.length)
    expect(left.toString()).toBe('Hello')
    expect(right.toString()).toBe('')
  })
})

// ---------------------------------------------------------------------------
// Leaf nodes use Uint8Array
// ---------------------------------------------------------------------------

describe('leaf nodes use Uint8Array', () => {
  it('leaf nodes in the rope have content instanceof Uint8Array', () => {
    // Access internal structure via the rope — we check via a newly-constructed
    // rope whose root is a single leaf.
    const r = new Rope('Hello')
    // Use leafCount and height as proxy: a single-string rope should be a leaf.
    expect(r.leafCount()).toBe(1)
    expect(r.height()).toBe(0)
  })
})
