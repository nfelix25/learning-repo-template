## Content manifest

### Outline

**Intro**: Before TypeScript 4.0, typing a `concat(a, b)` that worked for any tuple lengths required dozens of overloads. Variadic tuple types replaced that wall with a single, precise signature. The same technique powers typed `pipe`, `curry`, and middleware chains.

**Mechanic**:
- `[...T, ...U]` where `T` and `U` are constrained to `any[]`: produces a tuple type concatenating both.
- Rest elements in any position (TS 4.2): `[...string[], number]`, `[boolean, ...string[], boolean]`. One rest per tuple; no optional after rest.
- Labeled tuple elements: `[start: number, end: number]` — documentation only, no type system effect.
- `Head<T>`: `T extends [infer H, ...any[]] ? H : never`.
- `Tail<T>`: `T extends [any, ...infer Rest] ? Rest : never`.
- `Prepend<T extends any[], E>`: `[E, ...T]`.
- `Append<T extends any[], E>`: `[...T, E]`.
- Typed `pipe`: a function accepting `f1, f2, ..., fn` where each function's input must match the previous function's output type.

**Worked example**: Build a typed `pipe(f1, f2, f3)` where the type system infers the input parameter type from `f1`, verifies each consecutive pair of functions' output/input compatibility, and infers the final return type. Show that incompatible composition is a type error.

**Pitfalls**: Rest elements at leading/middle positions require TS 4.2 — write a clear version note. Labeled elements do not affect destructuring or type checking. Inferring tuple `Length` via `T['length']` is unreliable for variadic tuples since the length is a number range, not a literal.

**Exercise**: Implement `Concat<A, B>` for tuples; implement `Reverse<T>` for fixed-length tuples using recursive accumulator; implement a typed `curry<F>` that takes the first argument of a function and returns a new function expecting the rest.

### Sources

See `sources.md`.

### Version note

TypeScript 4.0+ for `[...T, ...U]` spreads. TypeScript 4.2+ for leading and middle rest elements.
