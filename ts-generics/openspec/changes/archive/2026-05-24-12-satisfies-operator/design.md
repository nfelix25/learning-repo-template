## Content manifest

### Outline

**Intro**: `palette.green.toUpperCase()` — valid? With a `: Record<Colors, string | RGB>` annotation, no, because `green` is typed as `string | RGB`. With `satisfies Record<Colors, string | RGB>`, yes — `green` is still known to be `string` because `satisfies` validates without widening. This one operator eliminates a whole category of defensive `as string` casts.

**Mechanic**:
- `expression satisfies Type` — validates that `expression` is assignable to `Type`, but the inferred type of the expression is preserved, not widened to `Type`.
- vs explicit annotation (`const x: Type = expr`) — annotation widens the type to `Type`. You lose narrower information.
- vs `as` cast (`expr as Type`) — `as` bypasses checking entirely. `satisfies` is a checked assertion.
- Catch typos: `{ red: [255,0,0], green: "#00ff00", bleu: [0,0,255] } satisfies Record<Colors, string | RGB>` — catches the `bleu` typo that an unannotated object literal would miss.
- Combining with `const`: `{ a: 1, b: 2 } as const satisfies Record<string, number>` — validates shape while keeping literal types `1` and `2`.
- Edge case: `satisfies` still checks assignability — it does not suppress errors, it just preserves the inferred type.

**Worked example**: A color `palette` object where each value is either a `string` (hex) or a `[number, number, number]` tuple. Show three versions: unannotated (no check), annotated (loses specific types), `satisfies` (validates + preserves). Demonstrate that only the `satisfies` version allows calling `.toUpperCase()` on `palette.green` without a type error.

**Pitfalls**: `satisfies` preserves the inferred type, which may be narrower OR wider than you expect depending on what TypeScript infers. For object literals, TypeScript's freshness check (excess property checking) applies with `satisfies` — keys not in the constraint type are still errors. `satisfies` does not prevent the value from being assigned to a wider type later.

**Exercise**: Refactor a configuration module that uses unsafe `as` casts into one using `satisfies`, verifying that the narrower inferred types are preserved and accessible downstream.

### Sources

See `sources.md`.

### Version note

`satisfies` was introduced in TypeScript 4.9.
