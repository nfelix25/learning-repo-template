import { expectTypeOf } from 'vitest'
import type { Json, DeepReadonly, DeepPartial, PromiseChain, DeepRequired } from './recursive-types'

// ---------------------------------------------------------------------------
// 1. Json
// ---------------------------------------------------------------------------

// Primitives are assignable to Json
const _str: Json = 'hello'
const _num: Json = 42
const _bool: Json = true
const _null: Json = null

// Arrays of Json are assignable to Json
const _arr: Json = [1, 'two', null, { key: true }]

// Nested objects are assignable to Json
const _obj: Json = { a: 1, b: [{ c: 'deep' }] }

// ---------------------------------------------------------------------------
// 2. DeepReadonly
// ---------------------------------------------------------------------------

type Nested = { user: { id: number; tags: string[] } }
type RONested = DeepReadonly<Nested>

expectTypeOf<RONested>().toEqualTypeOf<{
  readonly user: {
    readonly id: number
    readonly tags: readonly string[]
  }
}>()

// Primitives pass through unchanged
expectTypeOf<DeepReadonly<string>>().toEqualTypeOf<string>()

// ---------------------------------------------------------------------------
// 3. DeepPartial
// ---------------------------------------------------------------------------

type Config = { server: { host: string; port: number }; debug: boolean }
type PartialConfig = DeepPartial<Config>

expectTypeOf<PartialConfig>().toEqualTypeOf<{
  server?: { host?: string; port?: number }
  debug?: boolean
}>()

// ---------------------------------------------------------------------------
// 4. PromiseChain
// ---------------------------------------------------------------------------

expectTypeOf<PromiseChain<Promise<string>>>().toEqualTypeOf<string>()
expectTypeOf<PromiseChain<Promise<Promise<number>>>>().toEqualTypeOf<number>()
expectTypeOf<PromiseChain<Promise<Promise<Promise<boolean>>>>>().toEqualTypeOf<boolean>()
// Non-promise passes through
expectTypeOf<PromiseChain<string>>().toEqualTypeOf<string>()

// ---------------------------------------------------------------------------
// 5. DeepRequired
// ---------------------------------------------------------------------------

type Sparse = { a?: { b?: { c?: number } } }
type Full = DeepRequired<Sparse>

expectTypeOf<Full>().toEqualTypeOf<{ a: { b: { c: number } } }>()
