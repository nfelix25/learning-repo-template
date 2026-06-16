// Lesson 12 — The satisfies Operator
// ─────────────────────────────────────────────────────────────────────────────
// Each stub uses an explicit annotation or `as` cast that widens the type.
// Replace the annotation/cast with `satisfies` to preserve the narrower type.
//
// Run `npm run verify` to check. (Type-level only — npm test passes with stubs.)
// ─────────────────────────────────────────────────────────────────────────────

type RGB = readonly [number, number, number];
type PaletteEntry = string | RGB;
type Palette = Record<string, PaletteEntry>;

// Goal: Check this object against the palette shape without widening its known properties.
// After fix: palette.red should be string, palette.green should be readonly [number, number, number]
export const palette = {
  red: '#ff0000',
  green: [0, 255, 0] as const,
  blue: '#0000ff',
} as Palette;

// Goal: Check this object against the config shape while keeping the literal mode value.
// After fix: config.mode should be 'dark', not 'dark' | 'light'
type Config = { mode: 'dark' | 'light'; fontSize: number };
export const config: Config = {
  mode: 'dark',
  fontSize: 16,
};
