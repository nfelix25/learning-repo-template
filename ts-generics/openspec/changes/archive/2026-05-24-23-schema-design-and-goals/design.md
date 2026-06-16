## Content manifest

### Outline

**Intro**: `z.infer<typeof schema>` — you declare a schema at runtime, and TypeScript extracts a static type from it. This is the core trick of Zod, Valibot, and ArkType. How does a runtime value produce a compile-time type? The answer is a generic class or object where the type parameter `T` is stored not in a runtime field, but in a phantom field that only exists in the type system.

**Mechanic**:
- Core abstraction:
  ```
  type Schema<T> = {
    readonly _output: T;       // phantom field — never has a runtime value
    parse(input: unknown): T;
  }
  ```
- `_output` is declared but never assigned — it's a phantom type. TypeScript tracks it in the type, but no value is ever placed there. This is how the type `T` is preserved.
- `z.infer` extraction:
  ```
  type Infer<S extends Schema<unknown>> = S["_output"]
  ```
  Because `S["_output"]` is `T`, this extracts the output type from any schema.
- Design decision: class vs plain object. A class with a phantom field (`declare _output: T`) is the cleanest approach — TypeScript infers the class's generic parameter at construction.
- API surface: `parse(input: unknown): T` validates and returns the typed value (throws on failure); `safeParse(input: unknown): Result<ParseError, T>` returns a `Result` (connects to the first build piece).
- Zod v4 architecture overview: uses a similar `_output` / `_input` phantom field pattern with class-based schemas; the type inference chain is `z.infer<typeof schema>` → `typeof schema` = `ZodString` → `ZodString["_output"]` = `string`.

**Worked example**: Define `Schema<T>`, the `Infer<S>` utility type, and a `ParseError` type. Write a test verifying that `Infer<Schema<string>>` produces `string`. Design the full public API surface without implementing it.

**Pitfalls**: The phantom `_output` field must be declared with `declare` in a class or as a required field in the type — if it's optional (`_output?: T`), TypeScript may infer `undefined` instead of `T`. Choosing an object shape instead of a class makes it harder to constrain with `S extends Schema<unknown>`.

**Exercise**: Define `Schema<T>`, `Infer<S>`, and `ParseError`. Write the interface for all methods the schema should eventually support (`parse`, `safeParse`, `optional`, `array`). No implementation yet — only types and signatures.

### Build piece role

Design the `Schema<T>` type and establish the `z.infer`-style output type extraction goal before any implementation.

### Framing note

Zod v4 is the current stable reference (as of 2026-05-23). The lesson builds a simplified version; architectural divergences from Zod v4 are intentional simplifications.
