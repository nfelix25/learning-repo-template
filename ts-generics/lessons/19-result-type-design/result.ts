export type Ok<T> = { readonly _tag: 'Ok'; readonly value: T };
export type Err<E> = { readonly _tag: 'Err'; readonly error: E };
export type Result<E, T> = Ok<T> | Err<E>;

export function ok<T>(value: T): Ok<T> {
  return { _tag: 'Ok', value };
}

export function err<E>(error: E): Err<E> {
  return { _tag: 'Err', error };
}

export function isOk<E, T>(result: Result<E, T>): result is Ok<T> {
  return result._tag === 'Ok';
}

export function isErr<E, T>(result: Result<E, T>): result is Err<E> {
  return result._tag === 'Err';
}

// TODO: map, flatMap, mapErr — coming in lesson 20
// TODO: fold, unwrapOr, unwrapOrElse, getOrThrow — coming in lesson 21
// TODO: all — coming in lesson 22
