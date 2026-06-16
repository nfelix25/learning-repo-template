## Content manifest

### Outline

**Intro**: Before conditional types (TypeScript 2.8), the type system couldn't branch on the shape of another type. You could describe what a function accepted and returned, but not "returns `T` if `T` is a string, otherwise returns `never`." Conditional types changed that.

**Mechanic**:
- `T extends U ? X : Y` — if `T` is assignable to `U`, the type is `X`; otherwise `Y`.
- `never` is the bottom type: no value has type `never`. `T extends never ? X : Y` is always `Y` for any inhabited `T`.
- `unknown` is the top type: every value is assignable to `unknown`. `T extends unknown ? X : Y` is always `X`.
- Built-in utilities decoded:
  - `NonNullable<T>` = `T extends null | undefined ? never : T`
  - `Extract<T, U>` = `T extends U ? T : never`
  - `Exclude<T, U>` = `T extends U ? never : T`
- Deferred evaluation: when `T` is an unresolved generic type variable, TypeScript defers the conditional — it doesn't resolve until `T` is known. This is why `type Foo<T> = T extends string ? "yes" : "no"` returns the conditional itself rather than `"yes"` or `"no"` in generic position.

**Worked example**: Implement `IsArray<T>`, `Awaited<T>` (simplified), and `NonNullable<T>` from scratch. Compare your implementations to the TypeScript standard library definitions.

**Pitfalls**: Deferred evaluation causes surprises when you expect a conditional to resolve immediately inside a generic body. When `T` is a naked type variable, the type remains conditional — use concrete types or `extends never` checks to force resolution.

**Exercise**: Implement `IsString<T>`, `IsFunction<T>`, `Awaited<T>` (handling `Promise<Promise<string>>` recursion is a bonus), and `NonNullable<T>` from scratch without looking at the standard library.

### Sources

See `sources.md`.

### Version note

Conditional types were introduced in TypeScript 2.8. This lesson covers the stable, well-settled behavior.
