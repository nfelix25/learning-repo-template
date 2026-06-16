## Content manifest

### Outline

**Intro**: Before `const` type parameters, keeping literal types through a generic required callers to add `as const` at every call site — a leaky implementation detail. TypeScript 5.0 added the `const` modifier to type parameters, letting the function declare its own intent. If you've ever seen a generic that inexplicably widened a tuple to `string[]`, this is the fix.

**Mechanic**:
- `function f<const T extends readonly string[]>(x: T): T` — the `const` modifier tells TypeScript to infer `T` as narrowly as possible, treating inline values like `as const` were applied at the call site.
- Without `const`: `f(["a", "b"])` infers `T = string[]`.
- With `const`: `f(["a", "b"])` infers `T = readonly ["a", "b"]`.
- Critical rule: the constraint must be `readonly` — a mutable constraint like `string[]` prevents literal inference because `readonly ["a", "b"]` isn't assignable to `string[]`. TypeScript silently falls back to widened inference.
- Variables are unaffected: `const arr = ["a"]; f(arr)` still infers `string[]` — `const` type params only affect inline expressions.

**Worked example**: A typed route builder — `makeRoutes<const T extends readonly string[]>(routes: T)` — where the inferred `T` drives a `Record<T[number], Handler>` return type. Show the call site with and without `const` to contrast the inferred types.

**Pitfalls**: Mutable constraint + `const` modifier = silent widening. Always use `readonly` in the constraint when you want literal inference. Variables assigned before the call lose literal types regardless of `const`. The `const` modifier does not make the value immutable at runtime.

**Exercise**: Implement `makeConfig<const T extends readonly string[]>(keys: T): Record<T[number], unknown>` and verify that literal tuple inference flows correctly into the return type.

### Sources

See `sources.md`.

### Version note

`const` type parameters require TypeScript 5.0 or later.
