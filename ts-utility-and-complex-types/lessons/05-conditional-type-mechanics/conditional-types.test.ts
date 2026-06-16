import { expectTypeOf } from 'vitest'
import type { IsArray, IsPromise, UnwrapPromise, NonNullish, IfExtends } from './conditional-types'

// ---------------------------------------------------------------------------
// 1. IsArray
// ---------------------------------------------------------------------------

expectTypeOf<IsArray<string[]>>().toEqualTypeOf<true>()
expectTypeOf<IsArray<number[]>>().toEqualTypeOf<true>()
expectTypeOf<IsArray<string>>().toEqualTypeOf<false>()
expectTypeOf<IsArray<{ length: number }>>().toEqualTypeOf<false>()

// ---------------------------------------------------------------------------
// 2. IsPromise
// ---------------------------------------------------------------------------

expectTypeOf<IsPromise<Promise<string>>>().toEqualTypeOf<true>()
expectTypeOf<IsPromise<Promise<void>>>().toEqualTypeOf<true>()
expectTypeOf<IsPromise<string>>().toEqualTypeOf<false>()
expectTypeOf<IsPromise<{ then: () => void }>>().toEqualTypeOf<false>()

// ---------------------------------------------------------------------------
// 3. UnwrapPromise
// ---------------------------------------------------------------------------

expectTypeOf<UnwrapPromise<Promise<string>>>().toEqualTypeOf<string>()
expectTypeOf<UnwrapPromise<Promise<number[]>>>().toEqualTypeOf<number[]>()
// Non-promise passes through
expectTypeOf<UnwrapPromise<string>>().toEqualTypeOf<string>()
expectTypeOf<UnwrapPromise<number>>().toEqualTypeOf<number>()

// ---------------------------------------------------------------------------
// 4. NonNullish
// ---------------------------------------------------------------------------

expectTypeOf<NonNullish<string | null>>().toEqualTypeOf<string>()
expectTypeOf<NonNullish<string | undefined>>().toEqualTypeOf<string>()
expectTypeOf<NonNullish<string | null | undefined>>().toEqualTypeOf<string>()
expectTypeOf<NonNullish<string>>().toEqualTypeOf<string>()

// ---------------------------------------------------------------------------
// 5. IfExtends
// ---------------------------------------------------------------------------

expectTypeOf<IfExtends<string, string, 'yes', 'no'>>().toEqualTypeOf<'yes'>()
expectTypeOf<IfExtends<number, string, 'yes', 'no'>>().toEqualTypeOf<'no'>()
expectTypeOf<IfExtends<'hello', string, true, false>>().toEqualTypeOf<true>()
