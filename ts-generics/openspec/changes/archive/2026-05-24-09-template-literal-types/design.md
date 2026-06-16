## Content manifest

### Outline

**Intro**: Template literal types use the same backtick syntax as JavaScript template literals, but at the type level. `` `hello ${World}` `` where `World = "world"` produces the literal type `"hello world"`. When you combine them with union types, TypeScript generates every combination — which is powerful for event systems and API key patterns.

**Mechanic**:
- Basic syntax: `` type Greeting = `hello ${World}` `` produces `"hello world"`.
- Union cross-product: `` `${Quantity | Color} fish` `` produces `"one fish" | "two fish" | "red fish" | "blue fish"` — every combination of the two unions.
- Intrinsic string manipulation types (all introduced in TypeScript 4.1):
  - `Uppercase<S>` — all characters uppercase.
  - `Lowercase<S>` — all characters lowercase.
  - `Capitalize<S>` — first character uppercase.
  - `Uncapitalize<S>` — first character lowercase.
  - These operate locale-unaware (via JavaScript's `toUpperCase()` / `toLowerCase()`).
- Mapped types + template literals: `` { on(event: `${string & keyof T}Changed`, cb: (v: any) => void): void } `` produces a typed event registration API.
- Inference from template literals: `` T extends `on${infer EventName}` ? EventName : never `` extracts the suffix.

**Worked example**: Build a `PropEventSource<T>` type that adds an `on` method to an object — `on("firstNameChanged", cb)` must be valid but `on("firstnamechanged", cb)` must not. Use template literals + `Capitalize` + `keyof` to construct the valid event name union.

**Pitfalls**: Large unions in interpolated positions create combinatorial explosion — 10 × 10 produces 100 literal types, which strains the type checker. Template literal inference only works with `infer` in the `extends` clause — you can't destructure template literals without a conditional type.

**Exercise**: Implement `CSSProperties` as a mapped type over a set of CSS property names, producing the camelCase version of each (e.g., `background-color` → `backgroundColor`) using template literals and `Capitalize`. Also implement `ExtractRouteParams<T>` that extracts `:paramName` segments from route strings.

### Sources

See `sources.md`.

### Version note

Template literal types were introduced in TypeScript 4.1. Intrinsic string manipulation types (`Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize`) were also introduced in TypeScript 4.1.
