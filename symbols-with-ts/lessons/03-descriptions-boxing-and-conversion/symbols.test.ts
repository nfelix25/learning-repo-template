import { describe, expect, it } from "vitest";
import {
  explicitSymbolText,
  implicitConcatThrows,
  wrapperDescription,
  wrapperValueMatches
} from "./symbols.js";

describe("Lesson 03: Descriptions, boxing, and conversion", () => {
  it("uses explicit conversion for display text", () => {
    expect(explicitSymbolText(Symbol("debug"))).toBe("Symbol(debug)");
  });

  it("does not allow implicit string concatenation", () => {
    expect(implicitConcatThrows(Symbol("debug"))).toBe(true);
  });

  it("can inspect the primitive through a wrapper object", () => {
    const value = Symbol("wrapped");

    expect(wrapperDescription(value)).toBe("wrapped");
    expect(wrapperValueMatches(value)).toBe(true);
  });
});
