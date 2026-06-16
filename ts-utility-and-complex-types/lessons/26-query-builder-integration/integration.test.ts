import { describe, it, expect, expectTypeOf } from 'vitest'
import { AppSchema } from '../19-query-builder-schema-encoding/schema'
import { from } from './integration'

// ---------------------------------------------------------------------------
// Requirement: End-to-End Integration Test
// Scenario: Full query chain — join → select → where → limit → execute
// ---------------------------------------------------------------------------

// Build the complete query
const query = from(AppSchema, 'users')
  .join('posts', { left: 'users.id', right: 'posts.userId' })
  .select('users.name', 'posts.title', 'posts.deletedAt')
  .where({ column: 'users.name', operator: 'LIKE', value: 'A%' })
  .limit(20)

// Scenario: result type matches selected columns with correct nullability
type QueryResult = Awaited<ReturnType<typeof query.execute>>
expectTypeOf<QueryResult>().toEqualTypeOf<{
  'users.name': string
  'posts.title': string
  'posts.deletedAt': Date | null
}[]>()

// LEFT JOIN variant — posts columns become nullable
const leftQuery = from(AppSchema, 'users')
  .leftJoin('posts', { left: 'users.id', right: 'posts.userId' })
  .select('users.name', 'posts.title', 'posts.deletedAt')
  .where({ AND: [
    { column: 'users.id', operator: '>', value: 0 },
    { column: 'users.name', operator: '=', value: 'Alice' },
  ]})
  .limit(10)

// Scenario: full left-join query result type
type LeftQueryResult = Awaited<ReturnType<typeof leftQuery.execute>>
expectTypeOf<LeftQueryResult>().toEqualTypeOf<{
  'users.name': string
  'posts.title': string | null  // LEFT JOIN nullability
  'posts.deletedAt': Date | null  // schema nullable + LEFT JOIN
}[]>()

// ---------------------------------------------------------------------------
// Requirement: execute is still blocked without select
// ---------------------------------------------------------------------------

// @ts-expect-error joining but not selecting should block execute
from(AppSchema, 'users')
  .join('posts', { left: 'users.id', right: 'posts.userId' })
  .execute()

// ---------------------------------------------------------------------------
// Requirement: invalid column references are caught
// ---------------------------------------------------------------------------

// @ts-expect-error: "users.invalid" is not a valid column ref
from(AppSchema, 'users').select('users.invalid')

// @ts-expect-error: bare "name" (unqualified) is not accepted
from(AppSchema, 'users')
  .join('posts', { left: 'users.id', right: 'posts.userId' })
  .select('name')

// ---------------------------------------------------------------------------
// Runtime
// ---------------------------------------------------------------------------

describe('Lesson 26 — Query Builder Integration', () => {
  it('full inner-join query resolves', async () => {
    const result = await from(AppSchema, 'users')
      .join('posts', { left: 'users.id', right: 'posts.userId' })
      .select('users.name', 'posts.title')
      .where({ column: 'users.id', operator: '>', value: 0 })
      .limit(5)
      .execute()
    expect(Array.isArray(result)).toBe(true)
  })

  it('full left-join query resolves', async () => {
    const result = await from(AppSchema, 'users')
      .leftJoin('posts', { left: 'users.id', right: 'posts.userId' })
      .select('users.name', 'posts.deletedAt')
      .limit(5)
      .execute()
    expect(Array.isArray(result)).toBe(true)
  })

  it('orderBy and multiple where clauses chain cleanly', async () => {
    const result = await from(AppSchema, 'users')
      .where({ AND: [
        { column: 'users.id', operator: '>', value: 0 },
        { column: 'users.name', operator: 'LIKE', value: 'A%' },
      ]})
      .orderBy('users.createdAt', 'DESC')
      .limit(10)
      .select('users.id', 'users.name', 'users.email')
      .execute()
    expect(Array.isArray(result)).toBe(true)
  })
})
