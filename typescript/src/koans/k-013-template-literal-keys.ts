// ─── k-013: Template Literal Types as Mapped Keys ────────────────────────────
//
// Combining template literals with mapped types can generate multiple output
// keys per source key, creating rich type-safe interfaces from simple schemas.
//
// A single source key can map to many output keys:
//
//   type K = "name"
//   type Generated = `${K}` | `${K}Changed` | `${K}Error`
//   // → "name" | "nameChanged" | "nameError"
//
// When used inside a mapped type, this creates multiple properties per input key:
//
//   type WithEvents<T> = {
//     [K in keyof T as `${string & K}Changed`]: (prev: T[K], next: T[K]) => void
//   }
//
// This is how libraries like Zustand and XState generate typed event signatures
// from plain state schemas.
// ─────────────────────────────────────────────────────────────────────────────

import type { TODO, Expect, Equal } from "../utils/type-utils.js";

// ── Part 1: Generate change handlers from a state shape ──────────────────────
//
// `OnChangeHandlers<T>` maps `{ name: string; count: number }` to:
// `{ onNameChange: (value: string) => void; onCountChange: (value: number) => void }`

type OnChangeHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void;
};

type _1a = Expect<
  Equal<
    OnChangeHandlers<{ name: string; count: number }>,
    {
      onNameChange: (value: string) => void;
      onCountChange: (value: number) => void;
    }
  >
>;

// ── Part 2: Before/after event pairs ─────────────────────────────────────────
//
// `BeforeAfterHooks<T>` creates a `before${K}` and `after${K}` handler for each key.
// Both handlers receive the old value.

type BeforeAfterHooks<T> = {
  [K in keyof T as `${"before" | "after"}${Capitalize<string & K>}`]: T[K];
};

type _2a = Expect<
  Equal<
    BeforeAfterHooks<{ save: () => void }>,
    { beforeSave: () => void; afterSave: () => void }
  >
>;

type _2b = Expect<
  Equal<
    BeforeAfterHooks<{ login: () => void; logout: () => void }>,
    {
      beforeLogin: () => void;
      afterLogin: () => void;
      beforeLogout: () => void;
      afterLogout: () => void;
    }
  >
>;

// ── Part 3: Flattened nested keys ────────────────────────────────────────────
//
// `FlattenOne<T>` takes an object whose values are objects and produces a flat
// type with dot-notation keys (one level deep only).
//
//   FlattenOne<{ a: { x: string; y: number }; b: { z: boolean } }>
//   → { "a.x": string; "a.y": number; "b.z": boolean }

type FlattenOne<T extends Record<string, object>> = {
  [P in {
    [K in keyof T & string]: `${K}.${keyof T[K] & string}`;
  }[keyof T & string]]: P extends `${infer K}.${infer S}`
    ? K extends keyof T
      ? S extends keyof T[K]
        ? T[K][S]
        : never
      : never
    : never;
};

type _3a = Expect<
  Equal<
    FlattenOne<{ a: { x: string; y: number }; b: { z: boolean } }>,
    { "a.x": string; "a.y": number; "b.z": boolean }
  >
>;

// ── Part 4: CSS property variants ────────────────────────────────────────────
//
// CSS shorthand properties have per-side variants: `margin` → `marginTop`,
// `marginRight`, `marginBottom`, `marginLeft`.
//
// `WithSides<T, Sides>` expands each key K in T into K + each side:
//
//   WithSides<{ margin: number }, "Top" | "Bottom">
//   → { marginTop: number; marginBottom: number }

type WithSides<T, Sides extends string> = {
  [K in keyof T as `${string & K}${Sides}`]: T[K];
};

type _4a = Expect<
  Equal<
    WithSides<
      { margin: number; padding: number },
      "Top" | "Bottom" | "Left" | "Right"
    >,
    {
      marginTop: number;
      marginBottom: number;
      marginLeft: number;
      marginRight: number;
      paddingTop: number;
      paddingBottom: number;
      paddingLeft: number;
      paddingRight: number;
    }
  >
>;

import { describe, it } from "vitest";
describe("type-level koan", () => {
  it.todo("solve via: pnpm typecheck");
});
