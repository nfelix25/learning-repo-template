# Lesson 26 — Schema Array and Recursion

> Architecture reference: Zod v4 (stable as of 2026-05-23).

## Motivation

Objects and primitives cover most data shapes, but collections are fundamental. `ArraySchema<T>` validates that every element in an array satisfies a schema, producing a precisely-typed `T[]`.

More interesting is the problem of *recursive data structures*. A tree node contains an array of child nodes — the same type. You can't directly write `const treeSchema = object({ children: array(treeSchema) })` because `treeSchema` isn't defined yet when it's referenced. `LazySchema<T>` solves this with a getter function that's called at parse time, not definition time.

## Mechanic

### `ArraySchema<T>`

```typescript
export class ArraySchema<T> extends Schema<T[]> {
  constructor(readonly element: Schema<T>) { super(); }

  parse(input: unknown): T[] {
    if (!Array.isArray(input)) throw new ParseError('Expected array');
    return input.map((item, i) => {
      try {
        return this.element.parse(item);
      } catch (e) {
        if (e instanceof ParseError) {
          throw new ParseError(e.message, [i, ...e.path]);
        }
        throw e;
      }
    });
  }
}
```

`ArraySchema<T>` extends `Schema<T[]>`, so `Infer<ArraySchema<StringSchema>>` = `string[]`. The element schema validates each item; failures include the array index in the error path: `[2, 'email']` means "the `email` field of element at index 2".

**`noUncheckedIndexedAccess`** is active in this project. `input[i]` returns `T | undefined`. The `Array.isArray` check confirms the array type, but index access on the `item` in `map` is safe since `map` guarantees the callback receives actual elements.

### `LazySchema<T>`

```typescript
export class LazySchema<T> extends Schema<T> {
  constructor(readonly getter: () => Schema<T>) { super(); }

  parse(input: unknown): T {
    return this.getter().parse(input);
  }
}
```

The `getter` is a thunk — a zero-argument function that returns a schema. It's called only when `parse` runs, by which time all schemas in scope are fully initialized. This breaks the circular reference at *definition* time while still correctly delegating at *parse* time.

The type parameter `T` in `LazySchema<T>` must be annotated when used in recursive contexts, because TypeScript can't infer it from a circular reference. See the worked example below.

### Recursive schema pattern

```typescript
interface TreeNode {
  value: string;
  children: TreeNode[];
}

// Explicit type annotation breaks the circularity at the type level
const treeSchema: Schema<TreeNode> = object({
  value: s.string(),
  children: array(lazy(() => treeSchema)),
});
```

Three pieces work together:
1. `Schema<TreeNode>` — the explicit type annotation tells TypeScript the shape before it resolves `treeSchema`'s value.
2. `lazy(() => treeSchema)` — the getter captures `treeSchema` by reference; at call time it's fully initialized.
3. `array(...)` — wraps the lazy schema to handle the `children` array.

## Worked Example

```typescript
// Flat case — no recursion needed
const tagsSchema = array(s.string());
tagsSchema.parse(['typescript', 'generics']); // ['typescript', 'generics']
tagsSchema.parse(['ts', 42]); // throws ParseError: Expected string — path: [1]

// Recursive JSON value type
type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

// Note: this needs a union schema (lesson 27) + lazy + object to fully implement.
// For now, a simple recursive list:
interface NestedList {
  value: number;
  rest: NestedList | null;
}
// See lesson 27 for union support.

// Error path through nested arrays
const matrixSchema = array(array(s.number()));
try {
  matrixSchema.parse([[1, 2], [3, 'x']]);
} catch (e) {
  if (e instanceof ParseError) {
    console.log(e.path); // [1, 1] — row 1, column 1
  }
}
```

## Pitfalls

**`Array.isArray` vs `typeof`**: `typeof []` is `'object'`, not `'array'`. Always use `Array.isArray` to check for arrays.

**Recursive schemas require explicit type annotations**: TypeScript can't infer the type of `treeSchema` when it contains a reference to itself. Write `const treeSchema: Schema<TreeNode> = ...` explicitly.

**`lazy` getter is called on every `parse`**: The getter function runs every time `parse` is called. This is fine for most schemas (they're lightweight objects), but if you're computing something expensive in the getter, cache it in a closure.

**`lazy` doesn't prevent infinite recursion at *runtime***: `LazySchema` only breaks the *definition-time* cycle. If you parse a circular data structure (an object that contains itself as a child), the parser will recurse infinitely. Real parsers add depth limits.

**Index errors in `noUncheckedIndexedAccess`**: `input.map((item, i) => ...)` is safe — `map` guarantees `item` is defined. But if you index with `input[i]` in a loop, you'd get `T | undefined`.

## Exercise

1. Add a `minLength(n)` and `maxLength(n)` method to `ArraySchema<T>` that returns a new schema validating the length constraint.
2. Implement a `TupleSchema<Schemas extends Schema<unknown>[]>` that validates a fixed-length array where each position has its own schema. `Infer<TupleSchema<[StringSchema, NumberSchema]>>` should be `[string, number]`.
3. Use `lazy` to implement a JSON value schema: `type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }`. (Requires lesson 27's `union`.)
