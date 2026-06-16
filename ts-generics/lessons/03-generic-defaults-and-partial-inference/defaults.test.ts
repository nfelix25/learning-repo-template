import { describe, it, expect, expectTypeOf } from "vitest";
import { createStore, createPair, narrow } from "./defaults.js";

describe("03 — Generic Defaults and Partial Inference", () => {
  // ── createStore ──────────────────────────────────────────────────────────
  describe("createStore", () => {
    it("initialises state to null", () => {
      const store = createStore<number>();
      expect(store.state).toBeNull();
    });

    it("setState updates state", () => {
      const store = createStore<number>();
      store.setState(42);
      expect(store.state).toBe(42);
    });

    it("uses unknown as the default type", () => {
      // When no type argument is supplied, T should default to unknown
      const store = createStore();
      expectTypeOf(store.state).toEqualTypeOf<unknown | null>();
    });

    it("applies an explicit type argument", () => {
      const store = createStore<string>();
      expectTypeOf(store.state).toEqualTypeOf<string | null>();
    });
  });

  // ── createPair ───────────────────────────────────────────────────────────
  describe("createPair", () => {
    it("creates a runtime tuple", () => {
      expect(createPair("hello", 42)).toEqual(["hello", 42]);
    });

    it("infers both types independently when supplied", () => {
      const p = createPair("hello", 42);
      expectTypeOf(p).toEqualTypeOf<[string, number]>();
    });

    it("B defaults to A when only A is specified", () => {
      // Specifying just A; B falls back to the default A = string
      const p = createPair<string>("hello", "world");
      expectTypeOf(p).toEqualTypeOf<[string, string]>();
    });
  });

  // ── narrow ───────────────────────────────────────────────────────────────
  describe("narrow", () => {
    it("the inner function returns its argument unchanged", () => {
      const asString = narrow<string>();
      expect(asString("hello")).toBe("hello");
    });

    it("preserves the subtype U in the return type", () => {
      const asString = narrow<string>();
      const result = asString("hello");
      // Return type should be string (the bound T), or the subtype U
      expectTypeOf(result).toEqualTypeOf<"hello">();
    });

    it("the inner function is typed to the pinned T", () => {
      // The function returned by narrow<number>() should only accept numbers
      const asNumber = narrow<number>();
      expectTypeOf(asNumber).toEqualTypeOf<<U extends number>(value: U) => U>();
    });
  });
});
