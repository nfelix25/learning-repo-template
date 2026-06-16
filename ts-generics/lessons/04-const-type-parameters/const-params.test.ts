import { describe, it, expect, expectTypeOf } from "vitest";
import { tupleOf, makeConfig } from "./const-params.js";

describe("04 — const Type Parameters", () => {
  // ── tupleOf ──────────────────────────────────────────────────────────────
  describe("tupleOf", () => {
    it("returns the tuple unchanged at runtime", () => {
      expect(tupleOf([1, 2, 3])).toEqual([1, 2, 3]);
      expect(tupleOf(["a", "b"])).toEqual(["a", "b"]);
    });

    it("preserves a literal string tuple type (no widening)", () => {
      // Without `const T`, this infers string[] — the tuple is lost
      const result = tupleOf(["x", "y", "z"]);
      expectTypeOf(result).toEqualTypeOf<readonly ["x", "y", "z"]>();
    });

    it("preserves a literal number tuple type", () => {
      const result = tupleOf([1, 2, 3]);
      expectTypeOf(result).toEqualTypeOf<readonly [1, 2, 3]>();
    });
  });

  // ── makeConfig ───────────────────────────────────────────────────────────
  describe("makeConfig", () => {
    it("creates an object with the supplied keys at runtime", () => {
      const config = makeConfig(["host", "port", "debug"]);
      expect(Object.keys(config).sort()).toEqual(["debug", "host", "port"]);
    });

    it("return type has literal key names, not string", () => {
      // Without `const T`, T[number] = string → Record<string, unknown>
      const config = makeConfig(["host", "port", "debug"]);
      expectTypeOf(config).toEqualTypeOf<
        Record<"host" | "port" | "debug", unknown>
      >();
    });

    it("works with a single key", () => {
      const config = makeConfig(["name"]);
      expectTypeOf(config).toEqualTypeOf<Record<"name", unknown>>();
      expect("name" in config).toBe(true);
    });
  });
});
