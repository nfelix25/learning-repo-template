import { expectTypeOf } from 'vitest'
import type { MyExtract, MyExclude, ToArray, NonDistributiveIsArray, FilterNever } from './distributive'

// ---------------------------------------------------------------------------
// 1. MyExtract
// ---------------------------------------------------------------------------

expectTypeOf<MyExtract<'a' | 'b' | 'c', 'a' | 'c'>>().toEqualTypeOf<'a' | 'c'>()
expectTypeOf<MyExtract<string | number | boolean, string>>().toEqualTypeOf<string>()
expectTypeOf<MyExtract<string, number>>().toEqualTypeOf<never>()

// ---------------------------------------------------------------------------
// 2. MyExclude
// ---------------------------------------------------------------------------

expectTypeOf<MyExclude<'a' | 'b' | 'c', 'a'>>().toEqualTypeOf<'b' | 'c'>()
expectTypeOf<MyExclude<string | number | boolean, string | number>>().toEqualTypeOf<boolean>()
expectTypeOf<MyExclude<string, string>>().toEqualTypeOf<never>()

// ---------------------------------------------------------------------------
// 3. ToArray — distributes over union
// ---------------------------------------------------------------------------

expectTypeOf<ToArray<string>>().toEqualTypeOf<string[]>()
expectTypeOf<ToArray<number>>().toEqualTypeOf<number[]>()
expectTypeOf<ToArray<string | number>>().toEqualTypeOf<string[] | number[]>()

// ---------------------------------------------------------------------------
// 4. NonDistributiveIsArray — must NOT distribute
// ---------------------------------------------------------------------------

expectTypeOf<NonDistributiveIsArray<string[]>>().toEqualTypeOf<true>()
expectTypeOf<NonDistributiveIsArray<string>>().toEqualTypeOf<false>()
// Key: a union of arrays and non-arrays should be false (not boolean)
expectTypeOf<NonDistributiveIsArray<string[] | string>>().toEqualTypeOf<false>()

// ---------------------------------------------------------------------------
// 5. FilterNever
// ---------------------------------------------------------------------------

type Raw = { a: string; b: never; c: number; d: never }
expectTypeOf<FilterNever<Raw>>().toEqualTypeOf<{ a: string; c: number }>()
expectTypeOf<FilterNever<{ x: string }>>().toEqualTypeOf<{ x: string }>()
expectTypeOf<FilterNever<{ x: never }>>().toEqualTypeOf<{}>()
