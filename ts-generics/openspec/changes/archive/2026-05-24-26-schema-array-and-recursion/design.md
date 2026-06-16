## Content manifest

### Outline

**Intro**: `array(string())` should produce `Schema<string[]>`. `lazy(() => treeSchema)` should produce `Schema<TreeNode>` where `TreeNode` is defined in terms of the schema itself. The array case is easy; the lazy case requires careful handling of recursive types.

**Mechanic**:
- `ArraySchema<T>` extends `Schema<T[]>`:
  ```
  class ArraySchema<T> extends Schema<T[]> {
    constructor(readonly element: Schema<T>) { ... }
  }
  ```
  Output type: `T[]`. The element schema's `_output` becomes the element type of the array.
- `LazySchema<T>` for recursive schemas:
  ```
  class LazySchema<T> extends Schema<T> {
    constructor(readonly getter: () => Schema<T>) { ... }
  }
  function lazy<T>(getter: () => Schema<T>): LazySchema<T>
  ```
  `parse` calls `getter()` to obtain the actual schema at validation time, avoiding circular construction.
- Recursive schema example:
  ```
  interface TreeNode { value: string; children: TreeNode[] }
  const treeSchema: Schema<TreeNode> = object({
    value: string(),
    children: array(lazy(() => treeSchema))
  })
  ```
- "Type instantiation is excessively deep": occurs when TypeScript tries to expand recursive type aliases beyond its depth limit. Escape hatch: declare the final type with an explicit `interface` and use `satisfies` to verify the schema's output type matches.

**Worked example**: Implement `ArraySchema<T>` and `LazySchema<T>`. Define the `TreeNode` recursive schema. Show the depth limit error (by removing the explicit interface annotation) and fix it with the intermediate interface.

**Pitfalls**: `lazy()` defers schema construction to parse time — but the outer type must still be annotated explicitly (the `Schema<TreeNode>` annotation on the `treeSchema` variable) to prevent circular inference. Without the annotation, TypeScript either gives up or hits the depth limit.

**Exercise**: Implement `ArraySchema<T>`, `LazySchema<T>`, and `lazy()`. Build a recursive `CategorySchema` for a nested category tree. Write type-level tests verifying `Infer<typeof array(string())>` = `string[]`.

### Build piece role

Add array support and recursive schema capability via `lazy()`, forcing a confrontation with recursive inference limits.
