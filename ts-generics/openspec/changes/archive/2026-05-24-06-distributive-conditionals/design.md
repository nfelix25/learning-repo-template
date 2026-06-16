## Content manifest

### Outline

**Intro**: `type ToArray<T> = T extends any ? T[] : never`. Apply it to `string | number`. Without knowing about distributivity, you'd expect `(string | number)[]`. You get `string[] | number[]` instead. This lesson explains why — and how to choose between these behaviors deliberately.

**Mechanic**:
- When the checked type in a conditional is a "naked" type parameter (i.e., `T extends U` where `T` is not wrapped in another type), TypeScript distributes the conditional over each member of a union.
- `ToArray<string | number>` = `ToArray<string> | ToArray<number>` = `string[] | number[]`
- Suppression: wrap `T` in a tuple — `[T] extends [any] ? T[] : never` — to prevent distribution. Now `ToArray<string | number>` = `(string | number)[]`.
- Why the suppression works: `[string | number]` is a single tuple type, not a union, so distribution does not trigger.
- `Extract<T, U>` and `Exclude<T, U>` rely on distribution: `Extract<"a" | "b" | "c", "a" | "c">` = `"a" | "c"`.

**Worked example**: Implement a distributive `ToMaybe<T>` that wraps each union member in `{ value: T } | null`, and a non-distributive version that wraps the whole union. Show the contrast between the two results and when each is useful.

**Pitfalls**: Distribution only triggers on naked type parameters — `Array<T> extends ...` does not distribute. The behavior can produce unexpectedly wide union results in utility types that weren't intended to distribute. Always check whether your conditional is distributive before publishing.

**Exercise**: Implement `IsUnion<T>` (returns `true` for union types, `false` for single types — requires understanding when distribution fires and when it doesn't). Also implement both distributive and non-distributive versions of a `Nullable<T>` wrapper.

### Sources

See `sources.md`.

### Version note

Distributive conditional types were introduced with conditional types in TypeScript 2.8.
