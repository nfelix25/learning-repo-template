## Content manifest

### Outline

**Intro**: A `concat` function that takes `[1, 2]` and `[3, 4]` should return `[1, 2, 3, 4]` — not `(number | number)[]`. Before TypeScript 4.0, this required overloads for each arity. Variadic tuple types let you express this as `function concat<T extends unknown[], U extends unknown[]>(a: T, b: U): [...T, ...U]`.

**Mechanic**:
- `[...T, ...U]` where `T` and `U` extend `unknown[]` — TypeScript instantiates this with the actual tuple types inferred at the call site.
- Pre-4.0 restriction lifted: rest elements can now appear anywhere in a tuple, not just at the end: `[string, ...string[], number]` is valid.
- Unbounded spreads: if `T` is `string[]` (not a specific tuple), `[...T, boolean]` becomes `[...string[], boolean]` — an open-ended tuple.
- `tail` function: `function tail<T extends unknown[]>(arr: readonly [unknown, ...T]): T` — extracts everything after the first element with the correct tuple type.
- Partial application (`partialCall`): `function partialCall<T extends unknown[], U extends unknown[], R>(f: (...args: [...T, ...U]) => R, ...head: T): (...tail: U) => R` — a fully typed partial application without overloads.
- Connection to `Result.all`: the same variadic spread pattern enables collecting a `[Result<E1,T1>, Result<E2,T2>]` tuple into `Result<E1|E2, [T1,T2]>`.

**Worked example**: Implement `concat<T extends unknown[], U extends unknown[]>`, `tail<T extends unknown[]>`, and a simplified `pipe2<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C` using explicit tuples. Show how the spread preserves all positional type information.

**Pitfalls**: When `T` or `U` is `unknown[]` rather than a specific tuple, TypeScript produces an unbounded spread rather than a concrete tuple — inference limits still apply. Variadic tuples require TypeScript 4.0+.

**Exercise**: Implement `Concat<A extends unknown[], B extends unknown[]>` as a type-level utility, a typed `zip<T extends unknown[], U extends unknown[]>` that pairs elements, and a `partialCall` that curries the first argument off a generic function.

### Sources

See `sources.md`.

### Version note

Variadic tuple types require TypeScript 4.0 or later.
