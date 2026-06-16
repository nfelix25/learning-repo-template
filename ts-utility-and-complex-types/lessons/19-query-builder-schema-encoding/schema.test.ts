import { describe, it, expect, expectTypeOf } from 'vitest'
import { AppSchema, type Column, type TableSchema, type DatabaseSchema } from './schema'

// ---------------------------------------------------------------------------
// Requirement: Column Descriptor Type
// ---------------------------------------------------------------------------

describe('Lesson 19 — Query Builder: Schema Encoding', () => {
  it('Column accepts a valid column descriptor', () => {
    const col: Column = { dataType: 'string', nullable: false, primaryKey: false }
    expect(col.dataType).toBe('string')
    expect(col.nullable).toBe(false)
  })

  // -------------------------------------------------------------------------
  // Requirement: TableSchema Type
  // -------------------------------------------------------------------------

  it('TableSchema accepts a valid table definition', () => {
    const table: TableSchema = {
      id:   { dataType: 'number', nullable: false, primaryKey: true  },
      name: { dataType: 'string', nullable: false, primaryKey: false },
    }
    expect(table.id.primaryKey).toBe(true)
  })

  // -------------------------------------------------------------------------
  // Requirement: DatabaseSchema Type
  // -------------------------------------------------------------------------

  it('DatabaseSchema accepts multiple tables', () => {
    const schema: DatabaseSchema = AppSchema
    expect(Object.keys(schema)).toContain('users')
    expect(Object.keys(schema)).toContain('posts')
  })

  // -------------------------------------------------------------------------
  // Requirement: AppSchema sample schema
  // -------------------------------------------------------------------------

  it('AppSchema is accepted as DatabaseSchema', () => {
    const schema: DatabaseSchema = AppSchema
    expect(schema).toBeDefined()
  })

  it('AppSchema has the expected tables and columns', () => {
    expect(Object.keys(AppSchema.users)).toEqual(
      expect.arrayContaining(['id', 'name', 'email', 'createdAt'])
    )
    expect(Object.keys(AppSchema.posts)).toEqual(
      expect.arrayContaining(['id', 'userId', 'title', 'body', 'publishedAt', 'deletedAt'])
    )
  })
})

// ---------------------------------------------------------------------------
// Type-level assertions (spec scenarios)
// ---------------------------------------------------------------------------

// Scenario: AppSchema nullable column — deletedAt nullable is the literal true
expectTypeOf<typeof AppSchema['posts']['deletedAt']['nullable']>().toEqualTypeOf<true>()

// Scenario: non-nullable column — id nullable is the literal false
expectTypeOf<typeof AppSchema['users']['id']['nullable']>().toEqualTypeOf<false>()

// Column captures data type
expectTypeOf<typeof AppSchema['users']['name']['dataType']>().toEqualTypeOf<'string'>()
