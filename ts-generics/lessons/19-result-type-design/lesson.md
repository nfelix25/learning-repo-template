# Lesson 19 — Result Type Design

## Motivation

TypeScript functions can throw exceptions, but exceptions are invisible to the type system. A function declared as `function divide(a: number, b: number): number` may throw a `RangeError` at runtime — and the caller has no way to know this from the signature alone. The type says "returns a number" but reality is "returns a number *or* throws".

`Result<E, T>` solves this by making the error path part of the return type:

```typescript
function divide(a: number, b: number): Result<'division-by-zero', number>
```

Now the caller *must* handle the error case. The type system becomes your documentation, your linter, and your runtime safety net.

## Mechanic

A `Result<E, T>` is a **discriminated union** of two shapes:

```typescript
type Ok<T>  = { readonly _tag: 'Ok';  readonly value: T };
type Err<E> = { readonly _tag: 'Err'; readonly error: E };
type Result<E, T> = Ok<T> | Err<E>;
```

Three design decisions worth noting:

**Error-first convention**: `Result<E, T>` lists the error type before the value type. This mirrors Rust's `Result<T, E>` in spirit but flips the position — here `E` comes first to make it easy to default the success type later (though that's a lesson 3 topic).

**Readonly fields**: The `readonly` modifier prevents accidental mutation after construction. A `Result` is a value object — treat it as immutable.

**Narrow return types from factories**: The `ok()` function returns `Ok<T>`, *not* `Result<E, T>`. This gives callers immediate access to `.value` without a narrowing check. If you returned the wider union, TypeScript couldn't know which branch you were on.

```typescript
function ok<T>(value: T): Ok<T> {
  return { _tag: 'Ok', value };
}

function err<E>(error: E): Err<E> {
  return { _tag: 'Err', error };
}
```

**Narrowing via type guards**:

```typescript
function isOk<E, T>(result: Result<E, T>): result is Ok<T> {
  return result._tag === 'Ok';
}

function isErr<E, T>(result: Result<E, T>): result is Err<E> {
  return result._tag === 'Err';
}
```

Or you can use discriminant narrowing directly — TypeScript understands `_tag` as a discriminant automatically:

```typescript
if (result._tag === 'Ok') {
  result.value // ✓ accessible here
}
```

## Worked Example

```typescript
import { ok, err, isOk, isErr, type Result } from './result.js';

function divide(a: number, b: number): Result<'division-by-zero', number> {
  if (b === 0) return err('division-by-zero' as const);
  return ok(a / b);
}

const r = divide(10, 2);

if (isOk(r)) {
  console.log('Result:', r.value); // r.value: number
} else {
  console.log('Error:', r.error); // r.error: 'division-by-zero'
}

// Or with direct discriminant check:
if (r._tag === 'Ok') {
  console.log(r.value);
}
```

Calling `divide(10, 0)` returns an `Err<'division-by-zero'>`. TypeScript prevents you from reading `.value` before narrowing — the only way to get the number out is to prove it succeeded first.

## Pitfalls

**Returning the wide union from factories**: If you write `function ok<E, T>(value: T): Result<E, T>`, the return type loses narrowing. Callers get `Result<E, T>` and must narrow even though you just created an `Ok`. Always return the specific variant type from factories.

**Inconsistent discriminant field names**: If some types use `_tag` and others use `type` or `kind`, TypeScript's discriminant narrowing won't work across the union. Pick one name and stick with it throughout your codebase.

**Adding `E` to `ok()`**: The `ok<T>()` factory has no `E` parameter — `Ok<T>` doesn't carry an error type. TypeScript will infer `E` as `never` when you assign `ok(1)` to a `Result<string, number>` variable, which is correct. Don't add a spurious `E` type parameter to `ok()`.

**Mutable fields**: Without `readonly`, a callee could reassign `result.value = 0` and break invariants. Readonly fields are cheap — use them.

## Exercise

Implement the Result module from scratch:

1. Define `Ok<T>`, `Err<E>`, and `Result<E, T>`.
2. Implement `ok<T>(value: T): Ok<T>` and `err<E>(error: E): Err<E>`.
3. Implement `isOk` and `isErr` as type predicates.
4. Write a `safeParse(s: string): Result<'invalid-json', unknown>` that wraps `JSON.parse` in a try/catch.
5. Write a `safeGet(obj: Record<string, unknown>, key: string): Result<'missing-key', unknown>` that checks for key existence before accessing.
