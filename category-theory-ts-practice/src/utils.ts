/**
 * UTILITIES
 * ═════════
 * Koan primitives and shared domain types used across all modules.
 * Do not modify this file — it is scaffolding, not an exercise.
 */

// ─── Koan primitives ─────────────────────────────────────────────────────────

// Named placeholder. Error messages show "_TODO" — the signal to fill something in.
declare const _TODO: unique symbol
export type TODO = typeof _TODO

// Value-level placeholder for function bodies. Compiles; throws at runtime.
export const todo = <T>(_note?: string): T => {
  throw new Error(_note ?? 'not implemented')
}

// ─── Type-level test utilities ────────────────────────────────────────────────

// Equal<X, Y> is `true` iff X and Y are the exact same type.
// The conditional-type trick avoids false positives with `any`.
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false

// Expect<T> is a compile-time assertion: fails if T is not `true`.
export type Expect<T extends true> = T

// ─── Shared domain types ──────────────────────────────────────────────────────

// Option<A> — a value that may or may not be present.
// Used across Parametricity, Functors, HKT, and Monads modules.
export type Option<A> =
  | { readonly _tag: 'None' }
  | { readonly _tag: 'Some'; readonly value: A }

export const None: Option<never> = { _tag: 'None' }
export const Some = <A>(value: A): Option<A> => ({ _tag: 'Some', value })

export const isNone = <A>(opt: Option<A>): opt is { _tag: 'None' } =>
  opt._tag === 'None'

export const isSome = <A>(opt: Option<A>): opt is { _tag: 'Some'; value: A } =>
  opt._tag === 'Some'
