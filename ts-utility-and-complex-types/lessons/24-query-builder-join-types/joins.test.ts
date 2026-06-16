import { describe, it, expect, expectTypeOf } from 'vitest'
import { AppSchema } from '../19-query-builder-schema-encoding/schema'
import { from } from '../23-query-builder-chained-builder/builder'
import type { JoinCondition, JoinedCols, LeftJoinNullable } from './joins'

type S = typeof AppSchema

// ---------------------------------------------------------------------------
// JoinCondition type
// ---------------------------------------------------------------------------

// Valid join condition
const validOn: JoinCondition<S, 'users', 'posts'> = {
  left: 'users.id',
  right: 'posts.userId',
}

// Scenario: JoinCondition rejects invalid column refs
// @ts-expect-error "posts.nonexistent" is not a valid column ref
const badOn: JoinCondition<S, 'users', 'posts'> = {
  left: 'users.id',
  right: 'posts.nonexistent',
}

// ---------------------------------------------------------------------------
// Requirement: join expands selectable columns
// ---------------------------------------------------------------------------

// Scenario: after join, can select columns from both tables
const joinedBuilder = from(AppSchema, 'users').join('posts', {
  left: 'users.id',
  right: 'posts.userId',
})

// Can now select posts columns without type error
const afterJoin = joinedBuilder.select('users.name', 'posts.title')
type JoinResult = Awaited<ReturnType<typeof afterJoin.execute>>
expectTypeOf<JoinResult>().toEqualTypeOf<{ 'users.name': string; 'posts.title': string }[]>()

// @ts-expect-error: unqualified column after join should not compile
joinedBuilder.select('name')

// ---------------------------------------------------------------------------
// Requirement: leftJoin marks joined table columns as nullable
// ---------------------------------------------------------------------------

// Scenario: leftJoin + select posts column → result has | null even for non-nullable columns
const leftJoinBuilder = from(AppSchema, 'users').leftJoin('posts', {
  left: 'users.id',
  right: 'posts.userId',
})

const leftJoinResult = leftJoinBuilder.select('users.name', 'posts.title', 'posts.deletedAt')
type LeftJoinResult = Awaited<ReturnType<typeof leftJoinResult.execute>>

// posts.title is non-nullable in schema, but becomes nullable after leftJoin
expectTypeOf<LeftJoinResult>().toEqualTypeOf<{
  'users.name': string
  'posts.title': string | null   // nullable due to LEFT JOIN
  'posts.deletedAt': Date | null  // nullable due to BOTH schema AND LEFT JOIN
}[]>()

// ---------------------------------------------------------------------------
// JoinedCols helper type
// ---------------------------------------------------------------------------

expectTypeOf<JoinedCols<S, 'users', 'posts'>>().toEqualTypeOf<
  | 'users.id' | 'users.name' | 'users.email' | 'users.createdAt'
  | 'posts.id' | 'posts.userId' | 'posts.title' | 'posts.body' | 'posts.publishedAt' | 'posts.deletedAt'
>()

// ---------------------------------------------------------------------------
// LeftJoinNullable helper type
// ---------------------------------------------------------------------------

expectTypeOf<LeftJoinNullable<'posts', 'posts.title'>>().toEqualTypeOf<true>()
expectTypeOf<LeftJoinNullable<'posts', 'users.name'>>().toEqualTypeOf<false>()

// ---------------------------------------------------------------------------
// Runtime
// ---------------------------------------------------------------------------

describe('Lesson 24 — JOIN Types', () => {
  it('join returns a new builder', () => {
    const b = from(AppSchema, 'users').join('posts', { left: 'users.id', right: 'posts.userId' })
    expect(b).toBeDefined()
  })

  it('leftJoin returns a new builder', () => {
    const b = from(AppSchema, 'users').leftJoin('posts', { left: 'users.id', right: 'posts.userId' })
    expect(b).toBeDefined()
  })

  it('full join+select+execute resolves a promise', async () => {
    const result = await from(AppSchema, 'users')
      .join('posts', { left: 'users.id', right: 'posts.userId' })
      .select('users.name', 'posts.title')
      .execute()
    expect(Array.isArray(result)).toBe(true)
  })
})
