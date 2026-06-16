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

export function map<E, T, U>(result: Result<E, T>, f: (value: T) => U): Result<E, U> {
  if (result._tag === 'Ok') return ok(f(result.value));
  return result;
}

export function flatMap<E, T, F, U>(
  result: Result<E, T>,
  f: (value: T) => Result<F, U>
): Result<E | F, U> {
  if (result._tag === 'Ok') return f(result.value);
  return result;
}

export function mapErr<E, T, F>(result: Result<E, T>, f: (error: E) => F): Result<F, T> {
  if (result._tag === 'Err') return err(f(result.error));
  return result;
}

export function fold<E, T, U>(
  result: Result<E, T>,
  onErr: (e: E) => U,
  onOk: (t: T) => U
): U {
  if (result._tag === 'Ok') return onOk(result.value);
  return onErr(result.error);
}

export function unwrapOr<E, T>(result: Result<E, T>, fallback: T): T {
  if (result._tag === 'Ok') return result.value;
  return fallback;
}

export function unwrapOrElse<E, T>(result: Result<E, T>, fallback: (e: E) => T): T {
  if (result._tag === 'Ok') return result.value;
  return fallback(result.error);
}

export function getOrThrow<E, T>(result: Result<E, T>): T {
  if (result._tag === 'Ok') return result.value;
  throw result.error;
}

// TODO: all — coming in lesson 22
