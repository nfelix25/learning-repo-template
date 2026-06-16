import { expectTypeOf } from 'vitest'
import { AppSchema } from '../19-query-builder-schema-encoding/schema'
import type { TableColumn, ParseTableColumn } from './column-refs'

type S = typeof AppSchema

// ---------------------------------------------------------------------------
// Requirement: TableColumn
// ---------------------------------------------------------------------------

// Scenario: TableColumn produces all qualified column references for a table
expectTypeOf<TableColumn<S, 'users'>>().toEqualTypeOf<
  'users.id' | 'users.name' | 'users.email' | 'users.createdAt'
>()

expectTypeOf<TableColumn<S, 'posts'>>().toEqualTypeOf<
  'posts.id' | 'posts.userId' | 'posts.title' | 'posts.body' | 'posts.publishedAt' | 'posts.deletedAt'
>()

// Scenario: "users.nonexistent" is not in TableColumn<S, "users">
type ValidUserCols = TableColumn<S, 'users'>
type _NotInUnion = 'users.nonexistent' extends ValidUserCols ? 'bad' : 'good'
expectTypeOf<_NotInUnion>().toEqualTypeOf<'good'>()

// ---------------------------------------------------------------------------
// Requirement: ParseTableColumn
// ---------------------------------------------------------------------------

// Scenario: extracts table and column
expectTypeOf<ParseTableColumn<'users.name'>>().toEqualTypeOf<{ table: 'users'; column: 'name' }>()
expectTypeOf<ParseTableColumn<'posts.deletedAt'>>().toEqualTypeOf<{ table: 'posts'; column: 'deletedAt' }>()

// Scenario: no dot → never
expectTypeOf<ParseTableColumn<'nodot'>>().toEqualTypeOf<never>()

// Extra: multiple dots — infer is greedy-left, so first dot is the split
expectTypeOf<ParseTableColumn<'a.b.c'>>().toEqualTypeOf<{ table: 'a'; column: 'b.c' }>()
