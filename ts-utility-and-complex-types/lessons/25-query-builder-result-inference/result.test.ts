import { describe, it, expect, expectTypeOf } from 'vitest'
import { AppSchema } from '../19-query-builder-schema-encoding/schema'
import { from, type ExecuteResult, type ColRefType, type QueryState } from './result'

type S = typeof AppSchema

// ---------------------------------------------------------------------------
// Requirement: ColRefType — single column ref → TypeScript type
// ---------------------------------------------------------------------------

// Non-nullable string
expectTypeOf<ColRefType<'users.name', S, never>>().toEqualTypeOf<string>()

// Nullable date (schema nullable)
expectTypeOf<ColRefType<'posts.deletedAt', S, never>>().toEqualTypeOf<Date | null>()

// Non-nullable column made nullable by LEFT JOIN (via NullTables)
expectTypeOf<ColRefType<'posts.title', S, 'posts'>>().toEqualTypeOf<string | null>()

// Non-nullable primary key
expectTypeOf<ColRefType<'users.id', S, never>>().toEqualTypeOf<number>()

// Invalid ref → never
expectTypeOf<ColRefType<'nodot', S, never>>().toEqualTypeOf<never>()
expectTypeOf<ColRefType<'users.nonexistent', S, never>>().toEqualTypeOf<never>()

// ---------------------------------------------------------------------------
// Requirement: ExecuteResult — maps all selected cols to their types
// ---------------------------------------------------------------------------

// Scenario: selected cols → primitive types
type State1 = { selectedCols: 'users.name' | 'users.email'; joinedTables: never; nullableTables: never }
expectTypeOf<ExecuteResult<State1, S>>().toEqualTypeOf<{
  'users.name': string
  'users.email': string
}>()

// Scenario: nullable column is preserved
type State2 = { selectedCols: 'posts.deletedAt'; joinedTables: never; nullableTables: never }
expectTypeOf<ExecuteResult<State2, S>>().toEqualTypeOf<{ 'posts.deletedAt': Date | null }>()

// Scenario: LEFT JOIN nullability overrides schema non-nullable
type State3 = {
  selectedCols: 'posts.title' | 'users.name'
  joinedTables: 'posts'
  nullableTables: 'posts'
}
expectTypeOf<ExecuteResult<State3, S>>().toEqualTypeOf<{
  'posts.title': string | null  // LEFT JOIN makes it nullable
  'users.name': string           // primary table: unchanged
}>()

// ---------------------------------------------------------------------------
// Requirement: execute returns Promise<ExecuteResult<State, S>[]>
// ---------------------------------------------------------------------------

// Scenario: execute return type matches selected columns
const q1 = from(AppSchema, 'users').select('users.name', 'users.email')
type R1 = Awaited<ReturnType<typeof q1.execute>>
expectTypeOf<R1>().toEqualTypeOf<{ 'users.name': string; 'users.email': string }[]>()

// Scenario: LEFT JOIN execute return type is correct
const q2 = from(AppSchema, 'users')
  .leftJoin('posts', { left: 'users.id', right: 'posts.userId' })
  .select('users.name', 'posts.title')
type R2 = Awaited<ReturnType<typeof q2.execute>>
expectTypeOf<R2>().toEqualTypeOf<{
  'users.name': string
  'posts.title': string | null
}[]>()

// ---------------------------------------------------------------------------
// Runtime
// ---------------------------------------------------------------------------

describe('Lesson 25 — Result Type Inference', () => {
  it('execute resolves to an array', async () => {
    const result = await from(AppSchema, 'users').select('users.name').execute()
    expect(Array.isArray(result)).toBe(true)
  })
})
