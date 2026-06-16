## Content manifest

### Outline

**Intro**: `type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never`. That `infer R` declares a type variable `R` that captures whatever type fills the return position of `T`. TypeScript introduces `R` into scope for the true branch. Without `infer`, you'd have to write nested indexed access gymnastics — or just give up.

**Mechanic**:
- `infer X` may only appear in the `extends` clause of a conditional type. TypeScript introduces `X` as a type variable bound to whatever matches at that position.
- Placement rules:
  - `T extends Array<infer Item>` — extracts the element type.
  - `T extends (...args: infer Params) => infer Ret` — extracts both parameters and return type simultaneously.
  - `T extends Promise<infer Value>` — unwraps one level of Promise.
- Multiple `infer` in one conditional: each captures a different position.
- **Covariant vs contravariant positions**: when the same `infer X` name appears in multiple positions, TypeScript merges the candidates:
  - Covariant positions (output positions): candidates are unioned. `T extends { a: infer U; b: infer U } ? U : never` gives `string | number` when `a` is `string` and `b` is `number`.
  - Contravariant positions (input/parameter positions): candidates are intersected. `T extends { a: (x: infer U) => void; b: (x: infer U) => void } ? U : never` gives `string & number` = `never`.
- TypeScript 4.7 added `extends` constraints on `infer` variables: `T extends [infer S extends string, ...unknown[]] ? S : never` — eliminates a nested conditional.
- `infer` inside template literal types: `T extends \`on${infer EventName}\` ? EventName : never` extracts the suffix.

**Worked example**: Implement `ReturnType<T>`, `Parameters<T>`, `UnwrapPromise<T>`, and `FirstArg<T>` from scratch. Show the covariant merging behavior explicitly by placing the same `infer` name in two object properties.

**Pitfalls**: `infer` in a parameter (contravariant) position with the same variable name in multiple parameters gives intersection — often `never`. `infer` can only appear in the `extends` clause, not in the result branches. Deeply nested `infer` is valid but can be hard to read; prefer named intermediate types.

**Exercise**: Implement `Awaited<T>` (recursively unwraps `Promise<T>` using `infer`), `PromiseReturn<T>` (returns the resolved value of a function that returns a Promise), and `ExtractEventName<T>` (extracts the event name from an `on${string}` pattern using `infer` inside a template literal).

### Sources

See `sources.md`.

### Version note

`infer` was introduced in TypeScript 2.8. `extends` constraints on `infer` variables (`infer S extends string`) were added in TypeScript 4.7.
