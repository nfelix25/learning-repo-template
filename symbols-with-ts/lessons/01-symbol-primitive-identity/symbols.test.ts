import { describe, expect, it } from "vitest";
import {
  makeLocalSymbol,
  makeRegistrySymbol,
  sameDescriptionAreSame,
  symbolConstructorThrows
} from "./symbols.js";

describe("Lesson 01: Symbol primitive identity", () => {
  it("keeps description separate from identity", () => {
    expect(sameDescriptionAreSame).toBe(false);
  });

  it("creates fresh local symbols with the requested description", () => {
    const first = makeLocalSymbol("token");
    const second = makeLocalSymbol("token");

    expect(first).not.toBe(second);
    expect(first.description).toBe("token");
    expect(Symbol.keyFor(first)).toBeUndefined();
  });

  it("uses the global registry only when requested", () => {
    const first = makeRegistrySymbol("lesson-01");
    const second = makeRegistrySymbol("lesson-01");

    expect(first).toBe(second);
    expect(Symbol.keyFor(first)).toBe("lesson-01");
  });

  it("recognizes that Symbol is not a constructor", () => {
    expect(symbolConstructorThrows()).toBe(true);
  });
});
