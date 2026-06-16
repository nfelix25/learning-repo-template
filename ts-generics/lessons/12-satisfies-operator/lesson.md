> Verified against TypeScript 4.9 on 2026-05-23.

# Lesson 12 — The satisfies Operator

## Motivation

TypeScript gives you two familiar tools to attach a type to a value:

```typescript
// Annotation — widens the variable's type to Config
const config: Config = { mode: 'dark', fontSize: 16 };

// Cast — overrides the type without checking
const palette = { red: '#ff0000' } as Palette;
```

Both have a cost. An annotation widens `config.mode` from the literal `'dark'` to the union `'dark' | 'light'` — TypeScript forgets what you actually wrote. A cast bypasses checking entirely — you can cast `{ red: 42 }` to `Palette` and TypeScript won't complain.

TypeScript 4.9 introduced `satisfies` to solve this: validate that a value is assignable to a type *without* losing the narrower inferred type.

## Mechanic

### The `satisfies` keyword

```typescript
expression satisfies Type
```

`satisfies` does two things:

1. **Checks** that `expression` is assignable to `Type`. This is the same check as an annotation — a type error if the shape doesn't match.
2. **Preserves** the narrower inferred type of `expression`. The variable's type is what TypeScript inferred, not `Type`.

```typescript
type Palette = Record<string, string | readonly [number, number, number]>;

const palette = {
  red: '#ff0000',
  green: [0, 255, 0] as const,
} satisfies Palette;

// palette.red is string  (not string | readonly [number, number, number] | undefined)
// palette.green is readonly [number, number, number]  (not string | ... | undefined)
```

### Comparing the three tools

| Tool | Checks shape? | Preserves narrow type? |
|------|--------------|----------------------|
| `: Type` annotation | Yes | No — widens to `Type` |
| `as Type` cast | No — bypasses check | No — assigns `Type` |
| `satisfies Type` | Yes | Yes — keeps inferred type |

### Why annotation loses the narrow type

When you write `const config: Config = { mode: 'dark', fontSize: 16 }`, TypeScript treats `config` as having type `Config = { mode: 'dark' | 'light'; fontSize: number }`. The `mode` property is `'dark' | 'light'` — TypeScript sees the variable through the annotation's lens.

With `satisfies`, the inferred type of the object literal is kept. `config.mode` stays `'dark'`.

### `noUncheckedIndexedAccess` and `Record` types

With `noUncheckedIndexedAccess` enabled, indexing a `Record<string, V>` produces `V | undefined` — even for string literal keys — because TypeScript doesn't know whether the key exists. When you use `as Palette` (or `: Palette`), the palette variable has type `Record<string, PaletteEntry>`, so `palette.red` is `PaletteEntry | undefined`.

With `satisfies Palette`, the variable keeps its full structural type `{ red: string; green: readonly [number, number, number]; blue: string }`. The keys are known, so `palette.red` is `string` with no `undefined`.

### `as const satisfies T`

Combining `as const` with `satisfies` is a common pattern: `as const` locks in literal types and readonly arrays, then `satisfies` validates the shape:

```typescript
const config = {
  mode: 'dark',
  fontSize: 16,
} as const satisfies Config;

// config.mode: 'dark'  (literal, readonly)
// config.fontSize: 16  (literal, readonly)
```

Use this when you want both validation and maximum narrowing.

## Worked example

```typescript
type RGB = readonly [number, number, number];
type PaletteEntry = string | RGB;
type Palette = Record<string, PaletteEntry>;

// With `as Palette`:
const palette1 = { red: '#ff0000', green: [0, 255, 0] as const } as Palette;
palette1.red;   // PaletteEntry | undefined
palette1.green; // PaletteEntry | undefined  ← no narrowing, no safety check

// With `satisfies Palette`:
const palette2 = { red: '#ff0000', green: [0, 255, 0] as const } satisfies Palette;
palette2.red;   // string
palette2.green; // readonly [number, number, number]

// satisfies still catches shape errors:
const bad = { red: 42 } satisfies Palette;
//                ^^  error: number is not assignable to PaletteEntry
```

## Pitfalls

**`satisfies` doesn't change the runtime value.** It's purely a compile-time check. The emitted JavaScript is identical whether you use `satisfies` or not.

**You can't use `satisfies` as a standalone statement** — it must be part of an expression. `palette satisfies Palette;` doesn't work; it must be the right-hand side of a variable declaration or assignment.

**`as const satisfies T` order matters.** `x as const satisfies T` applies `as const` first (narrowing all literals and making arrays readonly), then validates with `satisfies`. The reverse — `x satisfies T as const` — doesn't make syntactic sense.

**`satisfies` doesn't make properties readonly.** If you want immutability, combine with `as const` or add `readonly` to your type.

## Exercise

Open `satisfies.ts`. Two stubs use widening tools (`as Palette` and `: Config`) that erase the narrower inferred types.

For each stub:
1. Replace `as Palette` with `satisfies Palette`
2. Replace the `: Config` annotation with `satisfies Config` (remove the annotation, add `satisfies Config` after the object literal)

Run `npm run verify` to check your work. All type assertions should pass.
