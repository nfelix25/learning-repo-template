import { describe, it, expect, expectTypeOf } from 'vitest'
import { concat, type Prepend, type Append, type Concat, type Drop1 } from './variadic-tuples'

// ---------------------------------------------------------------------------
// 1. Prepend
// ---------------------------------------------------------------------------

expectTypeOf<Prepend<string, [number, boolean]>>().toEqualTypeOf<[string, number, boolean]>()
expectTypeOf<Prepend<string, []>>().toEqualTypeOf<[string]>()

// ---------------------------------------------------------------------------
// 2. Append
// ---------------------------------------------------------------------------

expectTypeOf<Append<[string, number], boolean>>().toEqualTypeOf<[string, number, boolean]>()
expectTypeOf<Append<[], string>>().toEqualTypeOf<[string]>()

// ---------------------------------------------------------------------------
// 3. Concat (type-level)
// ---------------------------------------------------------------------------

expectTypeOf<Concat<[string, number], [boolean, Date]>>().toEqualTypeOf<
  [string, number, boolean, Date]
>()
expectTypeOf<Concat<[], [string]>>().toEqualTypeOf<[string]>()
expectTypeOf<Concat<[string], []>>().toEqualTypeOf<[string]>()

// ---------------------------------------------------------------------------
// 4. concat (runtime)
// ---------------------------------------------------------------------------

describe('Lesson 13 — Variadic Tuple Types', () => {
  it('concat combines two tuples', () => {
    const result = concat([1, 'two'], [true])
    expect(result).toEqual([1, 'two', true])
  })

  it('concat preserves exact type', () => {
    const result = concat([1, 'two'] as [number, string], [true] as [boolean])
    expectTypeOf(result).toEqualTypeOf<[number, string, boolean]>()
  })
})

// ---------------------------------------------------------------------------
// 5. Drop1
// ---------------------------------------------------------------------------

expectTypeOf<Drop1<[string, number, boolean]>>().toEqualTypeOf<[number, boolean]>()
expectTypeOf<Drop1<[string]>>().toEqualTypeOf<[]>()
expectTypeOf<Drop1<[]>>().toEqualTypeOf<[]>()
