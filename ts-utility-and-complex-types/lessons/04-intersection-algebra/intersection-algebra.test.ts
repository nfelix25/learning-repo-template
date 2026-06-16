import { describe, it, expect, expectTypeOf } from 'vitest'
import { type WithTimestamps, type Merge, type IntersectValues, merge } from './intersection-algebra'

type User = { id: number; name: string }

// ---------------------------------------------------------------------------
// 1. WithTimestamps
// ---------------------------------------------------------------------------

expectTypeOf<WithTimestamps<User>>().toEqualTypeOf<{
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
}>()

// ---------------------------------------------------------------------------
// 2. Merge — B's keys override A's
// ---------------------------------------------------------------------------

type A = { color: string; size: number }
type B = { color: 'red'; weight: number }

// After Merge: color comes from B (literal 'red'), size from A, weight from B
expectTypeOf<Merge<A, B>>().toEqualTypeOf<{ size: number; color: 'red'; weight: number }>()

// Merge with empty B is just A
expectTypeOf<Merge<User, {}>>().toEqualTypeOf<User>()

// ---------------------------------------------------------------------------
// 3. IntersectValues
// ---------------------------------------------------------------------------

type Parts = { a: { x: number }; b: { y: string } }
// Should produce { x: number } & { y: string } — assignable to both
type IV = IntersectValues<Parts>

expectTypeOf<{ x: number; y: string }>().toMatchTypeOf<IV>()

// ---------------------------------------------------------------------------
// 4. merge runtime function
// ---------------------------------------------------------------------------

describe('Lesson 04 — Intersection Algebra', () => {
  it('merge combines objects with B winning on conflicts', () => {
    const result = merge({ color: 'blue', size: 10 }, { color: 'red' as const, weight: 5 })
    expect(result.color).toBe('red')
    expect(result.size).toBe(10)
    expect(result.weight).toBe(5)
  })

  it('merge with empty object returns original', () => {
    const user = { id: 1, name: 'Alice' }
    const result = merge(user, {})
    expect(result).toEqual(user)
  })
})
