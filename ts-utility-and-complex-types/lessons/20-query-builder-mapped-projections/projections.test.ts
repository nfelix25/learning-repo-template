import { expectTypeOf } from 'vitest'
import { AppSchema } from '../19-query-builder-schema-encoding/schema'
import type { ColumnNames, ColumnType, SelectResult } from './projections'

type S = typeof AppSchema

// ---------------------------------------------------------------------------
// Requirement: ColumnNames
// ---------------------------------------------------------------------------

// Scenario: ColumnNames returns all column names for a table
expectTypeOf<ColumnNames<S, 'users'>>().toEqualTypeOf<'id' | 'name' | 'email' | 'createdAt'>()
expectTypeOf<ColumnNames<S, 'posts'>>().toEqualTypeOf<
  'id' | 'userId' | 'title' | 'body' | 'publishedAt' | 'deletedAt'
>()

// ---------------------------------------------------------------------------
// Requirement: ColumnType
// ---------------------------------------------------------------------------

// Scenario: ColumnType for non-nullable string column
expectTypeOf<ColumnType<S, 'users', 'name'>>().toEqualTypeOf<string>()
expectTypeOf<ColumnType<S, 'users', 'email'>>().toEqualTypeOf<string>()

// Scenario: ColumnType for non-nullable number column
expectTypeOf<ColumnType<S, 'users', 'id'>>().toEqualTypeOf<number>()

// Scenario: ColumnType for non-nullable date column
expectTypeOf<ColumnType<S, 'users', 'createdAt'>>().toEqualTypeOf<Date>()

// Scenario: ColumnType for nullable date column
expectTypeOf<ColumnType<S, 'posts', 'deletedAt'>>().toEqualTypeOf<Date | null>()

// Scenario: non-nullable string column is NOT nullable
expectTypeOf<ColumnType<S, 'posts', 'title'>>().toEqualTypeOf<string>()

// ---------------------------------------------------------------------------
// Requirement: SelectResult
// ---------------------------------------------------------------------------

// Scenario: SelectResult maps selected columns to their types
expectTypeOf<SelectResult<S, 'users', 'name' | 'email'>>().toEqualTypeOf<{
  name: string
  email: string
}>()

// Scenario: SelectResult includes nullable columns correctly
expectTypeOf<SelectResult<S, 'posts', 'title' | 'deletedAt'>>().toEqualTypeOf<{
  title: string
  deletedAt: Date | null
}>()

// Scenario: single column selection
expectTypeOf<SelectResult<S, 'users', 'id'>>().toEqualTypeOf<{ id: number }>()
