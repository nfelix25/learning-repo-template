import { describe, it, expectTypeOf } from "vitest";
import type {
  MyReturnType,
  MyParameters,
  MyAwaited,
  PromiseReturn,
  ExtractEventName,
} from "./infer.js";

describe("07 — The infer Keyword", () => {
  // ── MyReturnType ─────────────────────────────────────────────────────────
  describe("MyReturnType", () => {
    it("extracts the return type", () => {
      expectTypeOf<MyReturnType<() => string>>().toEqualTypeOf<string>();
      expectTypeOf<MyReturnType<(n: number) => boolean[]>>().toEqualTypeOf<
        boolean[]
      >();
    });

    it("returns never for non-functions", () => {
      expectTypeOf<MyReturnType<string>>().toEqualTypeOf<never>();
    });
  });

  // ── MyParameters ─────────────────────────────────────────────────────────
  describe("MyParameters", () => {
    it("extracts the parameter tuple", () => {
      expectTypeOf<
        MyParameters<(a: string, b: number) => void>
      >().toEqualTypeOf<[string, number]>();
      expectTypeOf<MyParameters<() => void>>().toEqualTypeOf<[]>();
    });
  });

  // ── MyAwaited ────────────────────────────────────────────────────────────
  describe("MyAwaited", () => {
    it("unwraps one level of Promise", () => {
      expectTypeOf<MyAwaited<Promise<string>>>().toEqualTypeOf<string>();
    });

    it("recursively unwraps nested Promises", () => {
      expectTypeOf<
        MyAwaited<Promise<Promise<number>>>
      >().toEqualTypeOf<number>();
    });

    it("leaves non-Promise types unchanged", () => {
      expectTypeOf<MyAwaited<string>>().toEqualTypeOf<string>();
    });
  });

  // ── PromiseReturn ─────────────────────────────────────────────────────────
  describe("PromiseReturn", () => {
    it("extracts the resolved type from a Promise-returning function", () => {
      expectTypeOf<
        PromiseReturn<() => Promise<string>>
      >().toEqualTypeOf<string>();
      expectTypeOf<
        PromiseReturn<(id: number) => Promise<boolean>>
      >().toEqualTypeOf<boolean>();
    });

    it("returns never for non-Promise-returning functions", () => {
      expectTypeOf<PromiseReturn<() => string>>().toEqualTypeOf<never>();
    });
  });

  // ── ExtractEventName ──────────────────────────────────────────────────────
  describe("ExtractEventName", () => {
    it("extracts the capitalized event name from an on-prefixed string", () => {
      expectTypeOf<ExtractEventName<"onClick">>().toEqualTypeOf<"Click">();
      expectTypeOf<ExtractEventName<"onChange">>().toEqualTypeOf<"Change">();
    });

    it("returns never for strings without the on prefix", () => {
      expectTypeOf<ExtractEventName<"click">>().toEqualTypeOf<never>();
    });
  });
});
