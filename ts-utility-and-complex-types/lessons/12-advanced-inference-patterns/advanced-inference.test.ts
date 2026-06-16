import { expectTypeOf } from 'vitest'
import type { Head, Tail, Last, Init, Zip } from './advanced-inference'

// ---------------------------------------------------------------------------
// 1. Head
// ---------------------------------------------------------------------------

expectTypeOf<Head<[string, number, boolean]>>().toEqualTypeOf<string>()
expectTypeOf<Head<[number]>>().toEqualTypeOf<number>()
expectTypeOf<Head<[]>>().toEqualTypeOf<never>()

// ---------------------------------------------------------------------------
// 2. Tail
// ---------------------------------------------------------------------------

expectTypeOf<Tail<[string, number, boolean]>>().toEqualTypeOf<[number, boolean]>()
expectTypeOf<Tail<[string]>>().toEqualTypeOf<[]>()
expectTypeOf<Tail<[]>>().toEqualTypeOf<[]>()

// ---------------------------------------------------------------------------
// 3. Last
// ---------------------------------------------------------------------------

expectTypeOf<Last<[string, number, boolean]>>().toEqualTypeOf<boolean>()
expectTypeOf<Last<[string]>>().toEqualTypeOf<string>()
expectTypeOf<Last<[]>>().toEqualTypeOf<never>()

// ---------------------------------------------------------------------------
// 4. Init
// ---------------------------------------------------------------------------

expectTypeOf<Init<[string, number, boolean]>>().toEqualTypeOf<[string, number]>()
expectTypeOf<Init<[string]>>().toEqualTypeOf<[]>()
expectTypeOf<Init<[]>>().toEqualTypeOf<[]>()

// ---------------------------------------------------------------------------
// 5. Zip
// ---------------------------------------------------------------------------

expectTypeOf<Zip<[string, number], [boolean, Date]>>().toEqualTypeOf<
  [[string, boolean], [number, Date]]
>()
expectTypeOf<Zip<[], []>>().toEqualTypeOf<[]>()
// Stop at shorter tuple
expectTypeOf<Zip<[string, number], [boolean]>>().toEqualTypeOf<[[string, boolean]]>()
