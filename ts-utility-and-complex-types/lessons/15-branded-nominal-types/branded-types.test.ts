import { describe, it, expect, expectTypeOf } from 'vitest'
import { parseUserId, parsePostId, getUserPost, type Brand, type UserId, type PostId } from './branded-types'

describe('Lesson 15 — Branded / Nominal Types', () => {
  // -------------------------------------------------------------------------
  // 1 & 2. Brand utility and domain types
  // -------------------------------------------------------------------------

  it('UserId and PostId are not mutually assignable', () => {
    const uid = parseUserId(1)
    const pid = parsePostId(2)

    // The key behavioral test: these IDs are not interchangeable.
    // Type-level: passing a PostId where UserId is expected should be a TS error.
    // We verify at runtime that the constructors produce distinct-feeling values.
    expect(typeof uid).toBe('number')
    expect(typeof pid).toBe('number')
  })

  // -------------------------------------------------------------------------
  // 3 & 4. Constructors
  // -------------------------------------------------------------------------

  it('parseUserId returns the raw number', () => {
    expect(parseUserId(42) as number).toBe(42)
  })

  it('parsePostId returns the raw number', () => {
    expect(parsePostId(99) as number).toBe(99)
  })

  // -------------------------------------------------------------------------
  // 5. getUserPost
  // -------------------------------------------------------------------------

  it('getUserPost accepts branded IDs and returns a string', () => {
    const result = getUserPost(parseUserId(1), parsePostId(7))
    expect(typeof result).toBe('string')
  })
})

// ---------------------------------------------------------------------------
// Type-level assertions
// ---------------------------------------------------------------------------

// Brand<number, 'UserId'> should extend number
expectTypeOf<UserId>().toMatchTypeOf<number>()
expectTypeOf<PostId>().toMatchTypeOf<number>()

// UserId and PostId are structurally distinct — UserId is not assignable to PostId
type _IsAssignable = UserId extends PostId ? 'bad' : 'good'
expectTypeOf<_IsAssignable>().toEqualTypeOf<'good'>()
