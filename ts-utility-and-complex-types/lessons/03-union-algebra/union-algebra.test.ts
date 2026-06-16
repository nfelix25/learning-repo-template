import { describe, it, expect, expectTypeOf } from 'vitest'
import { type AsyncState, assertNever, describeState, transition, type AsyncEvent } from './union-algebra'

// ---------------------------------------------------------------------------
// Type-level tests
// ---------------------------------------------------------------------------

// AsyncState<T> must be a discriminated union with a `status` discriminant.
// The tests below also verify runtime behavior once implemented.

// ---------------------------------------------------------------------------
// Runtime tests
// ---------------------------------------------------------------------------

describe('Lesson 03 — Union Algebra', () => {
  it('describeState returns correct string for idle', () => {
    const state = { status: 'idle' } as AsyncState<string>
    expect(describeState(state)).toMatch(/idle|not started/i)
  })

  it('describeState returns correct string for loading', () => {
    const state = { status: 'loading' } as AsyncState<string>
    expect(describeState(state)).toMatch(/loading/i)
  })

  it('describeState returns correct string for success', () => {
    const state = { status: 'success', data: 'hello' } as AsyncState<string>
    expect(describeState(state)).toMatch(/hello/)
  })

  it('describeState returns correct string for error', () => {
    const err = new Error('network failed')
    const state = { status: 'error', error: err } as AsyncState<string>
    expect(describeState(state)).toMatch(/network failed/)
  })

  it('transition: idle + fetch → loading', () => {
    const state: AsyncState<string> = { status: 'idle' }
    const next = transition(state, { type: 'fetch' })
    expect((next as { status: string }).status).toBe('loading')
  })

  it('transition: loading + resolve → success with data', () => {
    const state: AsyncState<number> = { status: 'loading' }
    const next = transition(state, { type: 'resolve', data: 42 })
    expect((next as { status: string; data: number }).status).toBe('success')
    expect((next as { status: string; data: number }).data).toBe(42)
  })

  it('transition: loading + reject → error with error', () => {
    const err = new Error('oops')
    const state: AsyncState<number> = { status: 'loading' }
    const next = transition(state, { type: 'reject', error: err })
    expect((next as { status: string }).status).toBe('error')
  })

  it('transition: any state + reset → idle', () => {
    const state: AsyncState<string> = { status: 'success', data: 'x' }
    const next = transition(state, { type: 'reset' })
    expect((next as { status: string }).status).toBe('idle')
  })
})
