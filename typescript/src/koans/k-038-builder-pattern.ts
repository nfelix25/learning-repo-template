// ─── k-038: The Builder Pattern with Type Accumulation ───────────────────────
//
// The builder pattern lets you construct objects incrementally. With TypeScript,
// you can encode the accumulated fields in the generic parameter, so `.build()`
// only appears when all required fields have been set:
//
//   const user = new UserBuilder()
//     .name("Alice")    // returns Builder<{ name: string }>
//     .age(30)          // returns Builder<{ name: string; age: number }>
//     .build()          // only available now — returns { name: string; age: number }
//
// Key technique: each method call returns a new builder type with the new field
// merged into the accumulated type via intersection or mapped type. The `.build()`
// method is only present when the accumulated type satisfies the full required shape.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest"
import type { Expect, Equal } from "../utils/type-utils.js"

// ── Part 1: Simple accumulating builder ──────────────────────────────────────
//
// Build a query builder for SQL-like queries.
// `.table(name)` sets the table — required.
// `.where(condition)` adds a WHERE clause — optional, chainable.
// `.limit(n)` adds a LIMIT — optional.
// `.build()` is only available after `.table()` has been called.

type QueryShape = { table?: string; where?: string; limit?: number }
type HasTable   = { table: string }

class QueryBuilder<Accumulated extends QueryShape = {}> {
  private _query: QueryShape = {}

  table(name: string): QueryBuilder<Accumulated & HasTable> {
    return Object.assign(Object.create(QueryBuilder.prototype), { _query: { ...this._query, table: name } }) as any
  }

  where(condition: string): QueryBuilder<Accumulated> {
    return Object.assign(Object.create(QueryBuilder.prototype), { _query: { ...this._query, where: condition } }) as any
  }

  limit(n: number): QueryBuilder<Accumulated> {
    return Object.assign(Object.create(QueryBuilder.prototype), { _query: { ...this._query, limit: n } }) as any
  }

  // build() is only available when Accumulated includes HasTable
  build(this: QueryBuilder<Accumulated & HasTable>): string {
    const q = (this as any)._query as Required<QueryShape>
    let sql = `SELECT * FROM ${q.table}`
    if (q.where) sql += ` WHERE ${q.where}`
    if (q.limit) sql += ` LIMIT ${q.limit}`
    return sql
  }
}

const _builder1 = new QueryBuilder()
const _builder2 = _builder1.table("users")
const _builder3 = _builder2.where("age > 18").limit(10)

type _1a = Expect<Equal<typeof _builder2 extends QueryBuilder<HasTable> ? true : false, true>>

describe("QueryBuilder", () => {
  it("builds a basic query", () => {
    const query = new QueryBuilder()
      .table("users")
      .build()
    expect(query).toBe("SELECT * FROM users")
  })
  it("builds a query with where and limit", () => {
    const query = new QueryBuilder()
      .table("products")
      .where("price > 100")
      .limit(20)
      .build()
    expect(query).toBe("SELECT * FROM products WHERE price > 100 LIMIT 20")
  })
})

// ── Part 2: Form builder with required fields ────────────────────────────────
//
// Build a form field definition builder.
// `.label()` and `.type()` are both required. `.placeholder()` is optional.
// `.toField()` only compiles when both `.label()` and `.type()` have been called.

type FieldDef = { label?: string; type?: string; placeholder?: string }
type FullField = { label: string; type: string; placeholder?: string }

class FieldBuilder<A extends FieldDef = {}> {
  private _def: FieldDef = {}

  label(text: string): FieldBuilder<A & { label: string }> {
    return Object.assign(Object.create(FieldBuilder.prototype), { _def: { ...this._def, label: text } }) as any
  }

  type(t: string): FieldBuilder<A & { type: string }> {
    return Object.assign(Object.create(FieldBuilder.prototype), { _def: { ...this._def, type: t } }) as any
  }

  placeholder(p: string): FieldBuilder<A> {
    return Object.assign(Object.create(FieldBuilder.prototype), { _def: { ...this._def, placeholder: p } }) as any
  }

  toField(this: FieldBuilder<A & FullField>): FullField {
    return (this as any)._def as FullField
  }
}

describe("FieldBuilder", () => {
  it("builds a complete field definition", () => {
    const field = new FieldBuilder()
      .label("Email")
      .type("email")
      .placeholder("enter your email")
      .toField()
    expect(field).toEqual({ label: "Email", type: "email", placeholder: "enter your email" })
  })
})
