## Content manifest

### Outline

**Intro**: Now that `Schema<T>` exists as an abstraction, it needs concrete implementations. `StringSchema` extends `Schema<string>`, `NumberSchema` extends `Schema<number>`, and `LiteralSchema<T extends Primitive>` extends `Schema<T>`. The key question: does TypeScript correctly infer `T` when you call `literal("active")`?

**Mechanic**:
- `class StringSchema extends Schema<string>`: `parse` validates `typeof input === "string"`, throws `ParseError` otherwise.
- `class NumberSchema extends Schema<number>`: similar validation.
- `class BooleanSchema extends Schema<boolean>`: similar.
- `class LiteralSchema<T extends string | number | boolean> extends Schema<T>`: stores the expected literal value; `parse` checks `input === this.literal`.
- Factory functions: `const s = { string: () => new StringSchema(), number: () => new NumberSchema(), literal: <T extends Primitive>(v: T) => new LiteralSchema(v) }`.
- `Infer` test: `type UserStatus = Infer<typeof s.literal("active")>` should be `"active"`, not `string`.
- Class vs object tradeoff: a class with `declare readonly _output: T` is cleanest. A plain object `{ _output: undefined as unknown as T }` works but the `as` cast is ugly. TypeScript infers the class's generic parameter at construction — `new LiteralSchema("active")` → `LiteralSchema<"active">` → `_output: "active"`.

**Worked example**: Implement all four schemas. Write `const schema = s.literal("active")` and verify with `expectTypeOf<Infer<typeof schema>>().toEqualTypeOf<"active">()`. Show the literal type being preserved through the `_output` phantom field.

**Pitfalls**: If `LiteralSchema<T>` is constructed with a widened type (e.g., `const v: string = "active"; new LiteralSchema(v)`), TypeScript infers `T = string`, not `"active"`. To fix: accept only literal inference at the factory level — the `const` type parameter lesson (04) is relevant here. If `_output` is not declared as `declare readonly`, it may get compiled to a runtime property assignment that breaks.

**Exercise**: Implement all four schemas and their factory functions. Verify end-to-end that `Infer<typeof string()>` = `string`, `Infer<typeof literal(42)>` = `42`, and that `parse` throws `ParseError` on invalid input.

### Build piece role

Implement primitive schemas and wire up the `z.infer` extraction pattern end-to-end for the simplest cases.
