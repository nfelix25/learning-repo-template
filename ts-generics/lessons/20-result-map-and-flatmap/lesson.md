# Lesson 20 — Result map and flatMap

## Motivation

You've built `Result<E, T>` and can construct and inspect values. But real programs need to *transform* results — apply logic to the success value without constantly unwrapping and re-wrapping. Without combinators, code becomes:

```typescript
const r1 = parse(input);
let r2: Result<ParseError, number>;
if (isOk(r1)) {
  r2 = ok(r1.value.length);
} else {
  r2 = r1;
}
```

With `map`, this collapses to one line: `const r2 = map(r1, v => v.length)`. The pattern scales — chains of transformations stay readable, and errors propagate automatically.

## Mechanic

### `map` — transform the success value

```typescript
function map<E, T, U>(result: Result<E, T>, f: (value: T) => U): Result<E, U>
```

- If `result` is `Ok<T>`, applies `f` and returns `Ok<U>`.
- If `result` is `Err<E>`, returns the error unchanged.
- The error type `E` is preserved — `map` cannot change error types.

### `flatMap` — chain fallible computations

```typescript
function flatMap<E, T, F, U>(
  result: Result<E, T>,
  f: (value: T) => Result<F, U>
): Result<E | F, U>
```

- If `result` is `Ok<T>`, calls `f(result.value)` which returns its own `Result<F, U>`.
- If `result` is `Err<E>`, short-circuits and returns the error.
- The return type is `Result<E | F, U>` — errors from both stages accumulate as a union.

This is the "monadic bind" operation. It lets you sequence fallible steps: parse, validate, transform — each step can fail with its own error type.

### `mapErr` — transform the error

```typescript
function mapErr<E, T, F>(result: Result<E, T>, f: (error: E) => F): Result<F, T>
```

- If `result` is `Err<E>`, applies `f` and returns `Err<F>`.
- If `result` is `Ok<T>`, returns the value unchanged.
- Useful for wrapping low-level errors into domain errors.

## Worked Example

```typescript
import { ok, err, map, flatMap, mapErr, type Result } from './result.js';

type ParseError = 'invalid-json';
type ValidationError = 'not-a-number';

function parseJson(s: string): Result<ParseError, unknown> {
  try {
    return ok(JSON.parse(s));
  } catch {
    return err('invalid-json');
  }
}

function extractNumber(v: unknown): Result<ValidationError, number> {
  if (typeof v === 'number') return ok(v);
  return err('not-a-number');
}

// Chain two fallible steps:
const doubled = flatMap(
  parseJson('42'),
  v => map(extractNumber(v), n => n * 2)
);
// doubled: Result<ParseError | ValidationError, number>
// isOk(doubled) === true, doubled.value === 84

// Map an error to a richer type:
const asError = mapErr(parseJson('bad'), kind => new Error(`Parse failed: ${kind}`));
// asError: Result<Error, unknown>
```

The error union `ParseError | ValidationError` is inferred automatically — TypeScript tracks which errors can escape without any manual annotation.

## Monadic Composition

`flatMap` makes `Result<E, T>` a *monad* (informally). The laws are:

1. **Left identity**: `flatMap(ok(a), f)` equals `f(a)`
2. **Right identity**: `flatMap(m, ok)` equals `m`
3. **Associativity**: `flatMap(flatMap(m, f), g)` equals `flatMap(m, x => flatMap(f(x), g))`

TypeScript doesn't enforce these algebraically, but they hold by construction in our implementation. The practical payoff: you can refactor chains of `flatMap` calls freely without changing behavior.

## Error Union Accumulation

Each `flatMap` in a chain widens the error type:

```typescript
const r1: Result<'A', number> = ok(1);
const r2 = flatMap(r1, n => err('B') as Result<'B', string>);
// r2: Result<'A' | 'B', string>
const r3 = flatMap(r2, s => err('C') as Result<'C', boolean>);
// r3: Result<'A' | 'B' | 'C', boolean>
```

By the end of a pipeline, the error type is the union of all errors that can occur. You handle them once at the edge, rather than at every step.

## Pitfalls

**Returning `Result<E, T>` from `f` in `map`**: `map`'s `f` must return a plain value `U`, not a `Result`. If `f` returns another `Result`, you'll get `Result<E, Result<F, U>>` — a nested result. Use `flatMap` when `f` is itself fallible.

**Losing the error union with explicit annotations**: If you annotate `flatMap`'s result as `Result<string, number>` instead of letting TypeScript infer it, you may accidentally narrow away error variants. Let inference work.

**`mapErr` vs `map`**: `mapErr` transforms the error path; `map` transforms the value path. They're symmetric but distinct — don't mix them up when you want to convert error types.

## Exercise

Build a small pipeline using `map`, `flatMap`, and `mapErr`:

1. Write `parseAge(s: string): Result<'not-a-number', number>` that tries `Number(s)` and checks for `NaN`.
2. Write `validateAge(n: number): Result<'out-of-range', number>` that checks `1 <= n <= 120`.
3. Chain them: `parseAndValidateAge(s: string): Result<'not-a-number' | 'out-of-range', number>`.
4. Use `mapErr` to convert the combined result's error to a human-readable `string`.
