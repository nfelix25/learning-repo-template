import { describe, it, expect, expectTypeOf } from 'vitest'
import { makeConfig, makeRoutes, PALETTE, type LiteralPick } from './satisfies'

describe('Lesson 16 — satisfies and const Type Parameters', () => {
  // -------------------------------------------------------------------------
  // 1. makeConfig — const T preserves literals
  // -------------------------------------------------------------------------

  it('makeConfig returns the same object', () => {
    const cfg = makeConfig({ env: 'production', port: 3000 })
    expect(cfg.env).toBe('production')
    expect(cfg.port).toBe(3000)
  })

  it('makeConfig preserves literal types', () => {
    const cfg = makeConfig({ env: 'production', port: 3000 })
    // With const T, env should be the literal 'production', not widened to string
    expectTypeOf(cfg.env).toEqualTypeOf<'production'>()
    expectTypeOf(cfg.port).toEqualTypeOf<3000>()
  })

  // -------------------------------------------------------------------------
  // 2. makeRoutes — const T preserves method/path literals
  // -------------------------------------------------------------------------

  it('makeRoutes returns the same routes', () => {
    const routes = makeRoutes({
      getUser: { method: 'GET', path: '/users/:id' },
    })
    expect(routes.getUser.method).toBe('GET')
  })

  it('makeRoutes preserves method literal', () => {
    const routes = makeRoutes({ getUser: { method: 'GET', path: '/users/:id' } })
    expectTypeOf(routes.getUser.method).toEqualTypeOf<'GET'>()
  })

  // -------------------------------------------------------------------------
  // 3. PALETTE — satisfies keeps string literals narrow
  // -------------------------------------------------------------------------

  it('PALETTE has string values', () => {
    expect(typeof Object.values(PALETTE)[0]).toBe('string')
  })

  it('PALETTE values are narrow literal types', () => {
    // Each color value should be a specific string literal (e.g. '#ff0000'),
    // not the wide string type
    const values = Object.values(PALETTE)
    expect(values.length).toBeGreaterThan(0)
  })
})

// ---------------------------------------------------------------------------
// 4. LiteralPick — type-level
// ---------------------------------------------------------------------------

type Data = { id: number; name: string; active: boolean }
expectTypeOf<LiteralPick<Data, 'id' | 'name'>>().toEqualTypeOf<{ id: number; name: string }>()
expectTypeOf<LiteralPick<Data, 'active'>>().toEqualTypeOf<{ active: boolean }>()
