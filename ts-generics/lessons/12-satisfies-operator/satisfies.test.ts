import { describe, it, expectTypeOf } from 'vitest';
import { palette, config } from './satisfies.js';

describe('12 — The satisfies Operator', () => {
  // ── palette ───────────────────────────────────────────────────────────────
  describe('palette', () => {
    it('palette.red has the narrower string type, not PaletteEntry | undefined', () => {
      // With `as Palette`, palette is Record<string, PaletteEntry>, so palette.red
      // is PaletteEntry | undefined (noUncheckedIndexedAccess). With `satisfies`,
      // the keys are known and palette.red is string.
      expectTypeOf(palette.red).toEqualTypeOf<string>();
    });

    it('palette.green has the narrower readonly [number, number, number] type, not PaletteEntry | undefined', () => {
      // With `as Palette`, palette.green is PaletteEntry | undefined.
      // With `satisfies`, palette.green is readonly [number, number, number].
      expectTypeOf(palette.green).toEqualTypeOf<readonly [number, number, number]>();
    });

    it('palette.blue has the narrower string type', () => {
      expectTypeOf(palette.blue).toEqualTypeOf<string>();
    });
  });

  // ── config ────────────────────────────────────────────────────────────────
  describe('config', () => {
    it('config.mode has the literal type "dark", not "dark" | "light"', () => {
      // With `: Config` annotation, config.mode is widened to 'dark' | 'light'.
      // With `satisfies Config`, config.mode keeps its inferred literal type 'dark'.
      expectTypeOf(config.mode).toEqualTypeOf<'dark'>();
    });

    it('config.fontSize has type number', () => {
      expectTypeOf(config.fontSize).toEqualTypeOf<number>();
    });
  });
});
