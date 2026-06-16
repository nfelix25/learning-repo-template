## Content manifest

### Outline

**Intro**: Before TypeScript 3.7, `type ValueOrArray<T> = T | Array<ValueOrArray<T>>` was an error. You needed an interface workaround: `interface ArrayOfValueOrArray<T> extends Array<ValueOrArray<T>> {}`. TypeScript 3.7 removed this restriction by using lazy type resolution at the top level of type aliases. Truly circular types (`type Foo = Foo`) are still rejected — only structurally-indirect recursion is supported.

**Mechanic**:
- Recursive type alias: `type Json = string | number | boolean | null | Json[] | { [key: string]: Json }` — now valid in TypeScript 3.7+.
- The key rule: recursive references must be wrapped in a type constructor (array, object, generic) that provides a level of structural indirection.
- `DeepPartial<T>`:
  ```
  type DeepPartial<T> = T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T
  ```
- `DeepReadonly<T>` follows the same pattern with `readonly` modifier.
- "Type instantiation is excessively deep" error: TypeScript limits recursive instantiation depth. The escape hatch is an intermediate type alias to break the chain: `type DeepPartialObject<T> = { [K in keyof T]?: DeepPartial<T[K]> }`.
- `infer` in recursive conditionals: `type ElementType<T> = T extends (infer U)[] ? ElementType<U> : T` recursively unwraps nested arrays.

**Worked example**: Implement the `Json` type, `DeepPartial<T>`, and a recursive `FlattenArray<T>` that unwraps `T[][]` to `T`. Show the depth limit error and fix it with an intermediate alias.

**Pitfalls**: Truly circular types are still errors. Recursive mapped types can hit depth limits on large nested structures — use lazy aliases or conditional breaks. TypeScript's recursive depth limit is an implementation constraint, not a language rule; it may change across versions.

**Exercise**: Implement `DeepReadonly<T>`, `FlattenArray<T>` (unwraps all array nesting), and a `JsonPath<T>` type that generates all valid dot-notation paths through a JSON-typed object.

### Sources

See `sources.md`.

### Version note

Recursive type aliases require TypeScript 3.7 or later.
