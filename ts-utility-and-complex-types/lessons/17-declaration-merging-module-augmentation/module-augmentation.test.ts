import { describe, it, expect, expectTypeOf } from 'vitest'
import { logger, PluginRegistry, type AppState } from './module-augmentation'

describe('Lesson 17 — Declaration Merging and Module Augmentation', () => {
  // -------------------------------------------------------------------------
  // 1 & 2. AppState interface merging
  // -------------------------------------------------------------------------

  it('AppState has merged properties from both declarations', () => {
    const state: AppState = {
      userId: 'u_1',
      sessionId: 's_abc',
      theme: 'dark',
    }
    expect(state.userId).toBe('u_1')
    expect(state.theme).toBe('dark')
  })

  // -------------------------------------------------------------------------
  // 3. logger function + namespace merge
  // -------------------------------------------------------------------------

  it('logger is callable as a function', () => {
    expect(() => logger('test message')).not.toThrow()
  })

  it('logger.warn is callable as a namespace method', () => {
    expect(() => logger.warn('careful')).not.toThrow()
  })

  // -------------------------------------------------------------------------
  // 4. PluginRegistry namespace merging
  // -------------------------------------------------------------------------

  it('PluginRegistry.registerPlugin is callable', () => {
    expect(() => PluginRegistry.registerPlugin({ name: 'my-plugin' })).not.toThrow()
  })

  // -------------------------------------------------------------------------
  // 5. Global augmentation — __appVersion
  // -------------------------------------------------------------------------

  it('__appVersion is settable on globalThis', () => {
    ;(globalThis as any).__appVersion = '1.0.0'
    expect((globalThis as any).__appVersion).toBe('1.0.0')
  })
})

// ---------------------------------------------------------------------------
// Type-level assertions
// ---------------------------------------------------------------------------

// AppState must have both merged sets of properties
expectTypeOf<AppState>().toHaveProperty('userId')
expectTypeOf<AppState>().toHaveProperty('sessionId')
expectTypeOf<AppState>().toHaveProperty('theme')
