import { describe, it, expect } from 'vitest'
import { isString, isNonNullish, assertDefined, hasProperty, assertNever } from './type-predicates'

describe('Lesson 14 — Type Predicates and Narrowing', () => {
  // -------------------------------------------------------------------------
  // 1. isString
  // -------------------------------------------------------------------------

  it('isString returns true for strings', () => {
    expect(isString('hello')).toBe(true)
    expect(isString('')).toBe(true)
  })

  it('isString returns false for non-strings', () => {
    expect(isString(42)).toBe(false)
    expect(isString(null)).toBe(false)
    expect(isString(undefined)).toBe(false)
    expect(isString({})).toBe(false)
  })

  it('isString narrows the type in a conditional', () => {
    const value: string | number = 'hello'
    if (isString(value)) {
      // TypeScript knows value is string here — calling toUpperCase should not error
      expect(value.toUpperCase()).toBe('HELLO')
    }
  })

  // -------------------------------------------------------------------------
  // 2. isNonNullish
  // -------------------------------------------------------------------------

  it('isNonNullish returns true for non-nullish values', () => {
    expect(isNonNullish('x')).toBe(true)
    expect(isNonNullish(0)).toBe(true)
    expect(isNonNullish(false)).toBe(true)
  })

  it('isNonNullish returns false for null and undefined', () => {
    expect(isNonNullish(null)).toBe(false)
    expect(isNonNullish(undefined)).toBe(false)
  })

  it('isNonNullish filters arrays correctly', () => {
    const arr = ['a', null, 'b', undefined, 'c']
    const result = arr.filter(isNonNullish)
    expect(result).toEqual(['a', 'b', 'c'])
  })

  // -------------------------------------------------------------------------
  // 3. assertDefined
  // -------------------------------------------------------------------------

  it('assertDefined does not throw for defined values', () => {
    expect(() => assertDefined('hello')).not.toThrow()
    expect(() => assertDefined(0)).not.toThrow()
  })

  it('assertDefined throws for undefined', () => {
    expect(() => assertDefined(undefined)).toThrow()
  })

  it('assertDefined includes the message when provided', () => {
    expect(() => assertDefined(undefined, 'value required')).toThrow('value required')
  })

  // -------------------------------------------------------------------------
  // 4. hasProperty
  // -------------------------------------------------------------------------

  it('hasProperty returns true when key exists', () => {
    expect(hasProperty({ name: 'Alice' }, 'name')).toBe(true)
  })

  it('hasProperty returns false when key is absent', () => {
    expect(hasProperty({ name: 'Alice' }, 'age')).toBe(false)
  })

  // -------------------------------------------------------------------------
  // 5. assertNever
  // -------------------------------------------------------------------------

  it('assertNever always throws', () => {
    expect(() => assertNever('oops' as never)).toThrow()
  })

  it('assertNever enables exhaustiveness checking', () => {
    type Color = 'red' | 'blue'

    function describe(c: Color): string {
      switch (c) {
        case 'red': return 'warm'
        case 'blue': return 'cool'
        default: return assertNever(c)
      }
    }

    expect(describe('red')).toBe('warm')
    expect(describe('blue')).toBe('cool')
  })
})
