import { expectTypeOf } from 'vitest'
import type { ElementType, FunctionReturn, FunctionParams, PromiseValue, FirstArgument } from './infer'

// ---------------------------------------------------------------------------
// 1. ElementType
// ---------------------------------------------------------------------------

expectTypeOf<ElementType<string[]>>().toEqualTypeOf<string>()
expectTypeOf<ElementType<number[]>>().toEqualTypeOf<number>()
expectTypeOf<ElementType<Array<boolean>>>().toEqualTypeOf<boolean>()
expectTypeOf<ElementType<string>>().toEqualTypeOf<never>()

// ---------------------------------------------------------------------------
// 2. FunctionReturn
// ---------------------------------------------------------------------------

expectTypeOf<FunctionReturn<() => string>>().toEqualTypeOf<string>()
expectTypeOf<FunctionReturn<(x: number) => boolean>>().toEqualTypeOf<boolean>()
expectTypeOf<FunctionReturn<string>>().toEqualTypeOf<never>()

// ---------------------------------------------------------------------------
// 3. FunctionParams
// ---------------------------------------------------------------------------

expectTypeOf<FunctionParams<(a: string, b: number) => void>>().toEqualTypeOf<[string, number]>()
expectTypeOf<FunctionParams<() => void>>().toEqualTypeOf<[]>()
expectTypeOf<FunctionParams<string>>().toEqualTypeOf<never>()

// ---------------------------------------------------------------------------
// 4. PromiseValue
// ---------------------------------------------------------------------------

expectTypeOf<PromiseValue<Promise<string>>>().toEqualTypeOf<string>()
expectTypeOf<PromiseValue<Promise<number[]>>>().toEqualTypeOf<number[]>()
expectTypeOf<PromiseValue<string>>().toEqualTypeOf<never>()

// ---------------------------------------------------------------------------
// 5. FirstArgument
// ---------------------------------------------------------------------------

expectTypeOf<FirstArgument<(a: string, b: number) => void>>().toEqualTypeOf<string>()
expectTypeOf<FirstArgument<(x: boolean) => void>>().toEqualTypeOf<boolean>()
expectTypeOf<FirstArgument<() => void>>().toEqualTypeOf<never>()
expectTypeOf<FirstArgument<string>>().toEqualTypeOf<never>()
