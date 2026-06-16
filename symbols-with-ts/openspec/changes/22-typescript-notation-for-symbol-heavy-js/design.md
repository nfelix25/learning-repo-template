## Content manifest

### Metadata

- Lesson: `22-typescript-notation-for-symbol-heavy-js`
- Currency: `versioned`
- Audio value: `low`
- Estimated minutes: 40

### Concepts

- symbol type
- unique symbol
- symbol-keyed interfaces
- PropertyKey
- typing well-known symbol methods

### Outline

**Intro**: TypeScript can make symbol-heavy JavaScript easier to state, but the runtime semantics stay JavaScript-first.

**Mechanic**: Introduce symbol, unique symbol, const-named properties, PropertyKey, and typed well-known symbol methods.

**Worked example**: Type an exported symbol token and an interface that requires a symbol-keyed method.

**Pitfalls**: unique symbol depends on const declarations and compiler support; declaration files vary by TypeScript version.

**Exercise setup**: Annotate the earlier API-token and iterable patterns without changing runtime code.

### Sources

See `sources.md`.

### Version note

Use the installed TypeScript version for exercises, and cite the TypeScript 2.7 release note for historical unique symbol support.
