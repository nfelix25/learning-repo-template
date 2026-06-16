## Content manifest

### Outline

**Intro**: `infer` is how you write "extract this part of the type and give it a name" — the declarative alternative to manually indexing through type structures. Every utility type that extracts something (`ReturnType`, `Parameters`, `Awaited`) uses it.

**Mechanic**:
- Syntax: `T extends SomePattern<infer U> ? U : never` — `U` is bound in the true branch only.
- Placement rules: `infer` only appears in the `extends` clause of a conditional type, never in the false branch or in type constraints.
- Multiple bindings: `T extends { a: infer U; b: infer V }` — two independent variables.
- Same variable in multiple positions: covariant positions (object property values, return types) → union of candidates; contravariant positions (function parameters) → intersection of candidates.
- Overloaded function caveat: `infer` from a call signature matches the last overload only (the most permissive catch-all).

**Worked example**: Build `DeepAwaited<T>` (recursive Promise unwrapping) and `FunctionParams<T>` (extract parameter tuple). Then demonstrate the contravariant intersection: `type Bar<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void } ? U : never` — show that `Bar<{ a: (x: string) => void; b: (x: number) => void }>` produces `string & number`.

**Pitfalls**: `infer` in object property values is covariant but in function parameters it is contravariant — the same name can appear in both positions with results that surprise people. `infer` is blocked in type constraint clauses (`<T extends infer U>` is illegal). The overloaded-function last-signature rule means `infer` cannot distinguish between overloads.

**Exercise**: Implement `UnpackPromiseArray<T>` using `infer` that extracts `U` from `Promise<U[]>`; implement `OverloadReturnTypes<T>` and observe the last-signature limitation.

### Sources

See `sources.md`.

### Version note

TypeScript 2.8+. The covariant→union / contravariant→intersection behavior is documented in the TS 2.8 release notes, not the current handbook.
