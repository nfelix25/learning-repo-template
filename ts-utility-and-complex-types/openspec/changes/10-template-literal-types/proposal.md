## Why

Template literal types let you construct, match, and transform string types programmatically. They are essential for generating event handler maps, CSS property keys, path DSLs, and — critically — the `"table.column"` reference strings in the query builder build piece.

## What Teaches

Template literal type syntax; union distribution across interpolation slots; intrinsic string types (`Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize`); extracting string components with `infer` in template positions.

## Prereqs

- `03-union-algebra`

## Success criterion

The test suite in `lessons/10-template-literal-types/template-literals.test.ts` passes.
