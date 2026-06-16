## Content manifest

### Outline

**Intro**: Once you understand `infer` in simple positions, the next frontier is using it with tuples and mapped types — which is where library authors spend most of their time. TS 4.0 variadic tuples made it possible to write typed versions of `concat`, `zip`, and function composition without drowning in overloads.

**Mechanic**:
- Inferring tuple element types: `T extends [infer Head, ...infer Tail]` to destructure a tuple type.
- Variadic tuple spreads (TS 4.0): `[...T, ...U]` where `T` and `U` are generic tuple types. Rest elements can appear in any position (TS 4.2).
- Inferring from mapped type values: using `infer` inside a mapped type value position. Result is covariant (union).
- Chained inference: using one `infer` result as the input to a second conditional. Example: extract the element type of a mapped type's value, then unwrap it further.
- `MapTuple<T, F>`: apply a type transformation to each element of a tuple.

**Worked example**: Build `ZipTuples<A, B>` that pairs corresponding elements of two fixed-length tuples into `[A[0], B[0]][]`. Then build `MapTuple<T, F>` that applies a type transformation to each tuple element using a mapped type with `infer`.

**Pitfalls**: `infer` in a mapped type value is covariant — if multiple candidates match, the result is their union, not a single type. Tuple length inference fails when variadic spreads are involved; use the accumulator pattern from lesson 11 instead. TypeScript doesn't always narrow tuple types inside generic functions — sometimes you need explicit constraints.

**Exercise**: Implement `Flatten<T extends any[]>` that flattens one level of array nesting using variadic spreads; implement `Head<T>` and `Tail<T>` that extract the first element and the rest of a tuple type.

### Sources

See `sources.md`.

### Version note

TypeScript 4.0+ for variadic tuple types. TypeScript 4.2+ for leading/middle rest elements.
