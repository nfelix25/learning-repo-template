## Content manifest

### Outline

**Intro**: Before TypeScript 3.7, writing `type JSON = string | number | boolean | null | JSON[] | { [k: string]: JSON }` was a type error. Recursive types unlocked a class of data structure descriptions that are now standard in every TypeScript codebase. TypeScript 4.1 then extended this to conditional types — enabling deep transformations — but at a cost: depth limits become real.

**Mechanic**:
- Recursive type aliases (TS 3.7): allowed in object literal, array, and tuple positions directly. Example: `type Json = string | number | boolean | null | Json[] | { [k: string]: Json }`.
- Recursive conditional types (TS 4.1): conditional type branches can reference the type being defined. Example: `type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T`.
- Depth limits: TS tracks instantiation depth. Large inputs hit the limit and produce "Type instantiation is excessively deep and possibly infinite."
- Tail recursion accumulator pattern: restructure recursion so the recursive call is in the final branch with an accumulator, allowing TS's optimization to extend the effective depth.
- `DeepReadonly<T>`: recursive mapped type example. Works well for moderate depth; hits limits on very deep objects.
- `Paths<T>`: produces a union of all dot-notation key paths — requires recursive conditional types.

**Worked example**: Build `Json` type first (TS 3.7 pattern). Then build `DeepReadonly<T>`. Then deliberately trigger the depth error with a deeply nested type, and fix it with an accumulator-style `DeepReadonlyHelper<T, _Seen>`.

**Pitfalls**: Recursive types in conditional branches evaluate more eagerly than recursive mapped types — small differences in structure determine whether TS can optimize. Circular references in interfaces are handled differently from type aliases (interfaces are lazily resolved). The tail recursion optimization requires a very specific structure — the accumulator must appear in the mapped/conditional output position.

**Exercise**: Implement `DeepMutable<T>` (inverse of `DeepReadonly`) using the accumulator pattern; implement `Paths<T>` that returns a union of all dot-notation path strings for a nested object type.

### Sources

See `sources.md`.

### Version note

TypeScript 3.7+ for recursive aliases. TypeScript 4.1+ for recursive conditional types.
