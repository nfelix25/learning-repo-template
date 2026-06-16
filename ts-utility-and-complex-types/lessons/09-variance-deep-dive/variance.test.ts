import { expectTypeOf } from 'vitest'
import type { ReadonlyBox, WriteOnlyBox, InvariantBox, IntersectParams } from './variance'

// ---------------------------------------------------------------------------
// 1. ReadonlyBox — covariant
// ---------------------------------------------------------------------------

type Animal = { name: string }
type Dog = Animal & { breed: string }

// Dog extends Animal, so ReadonlyBox<Dog> should extend ReadonlyBox<Animal> (covariant)
expectTypeOf<ReadonlyBox<Dog>>().toMatchTypeOf<ReadonlyBox<Animal>>()

// ---------------------------------------------------------------------------
// 2. WriteOnlyBox — contravariant
// ---------------------------------------------------------------------------

// Animal is broader than Dog, so WriteOnlyBox<Animal> extends WriteOnlyBox<Dog> (contravariant)
expectTypeOf<WriteOnlyBox<Animal>>().toMatchTypeOf<WriteOnlyBox<Dog>>()

// ---------------------------------------------------------------------------
// 3. InvariantBox — structural shape check
// ---------------------------------------------------------------------------

// InvariantBox must have both get() and set()
expectTypeOf<InvariantBox<string>>().toHaveProperty('get')
expectTypeOf<InvariantBox<string>>().toHaveProperty('set')

// ---------------------------------------------------------------------------
// 4. IntersectParams — contravariant infer
// ---------------------------------------------------------------------------

type T1 = IntersectParams<{ a: (x: string) => void; b: (x: number) => void }>
// Contravariant infer unifies to string & number
expectTypeOf<T1>().toEqualTypeOf<string & number>()

type T2 = IntersectParams<{ a: (x: { id: number }) => void; b: (x: { name: string }) => void }>
expectTypeOf<T2>().toEqualTypeOf<{ id: number } & { name: string }>()

// Non-matching shape passes through as never
expectTypeOf<IntersectParams<string>>().toEqualTypeOf<never>()
