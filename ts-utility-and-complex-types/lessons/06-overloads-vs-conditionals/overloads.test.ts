import { describe, it, expect, expectTypeOf } from "vitest";
import {
  format,
  parseValue,
  wrapInArray,
  createElement,
  type WrapReturn,
} from "./overloads";

// ---------------------------------------------------------------------------
// 1. format — overloaded string|number → string
// ---------------------------------------------------------------------------

describe("Lesson 06 — Overloads vs Conditional Return Types", () => {
  it("format returns a string for string input", () => {
    expect(typeof format("hello")).toBe("string");
  });

  it("format returns a string for number input", () => {
    expect(typeof format(42)).toBe("string");
  });

  // ---------------------------------------------------------------------------
  // 2. parseValue — overloaded swap
  // ---------------------------------------------------------------------------

  it("parseValue converts string to number", () => {
    expect(typeof parseValue("3.14")).toBe("number");
  });

  it("parseValue converts number to string", () => {
    expect(typeof parseValue(100)).toBe("string");
  });

  // ---------------------------------------------------------------------------
  // 3. wrapInArray — conditional return type
  // ---------------------------------------------------------------------------

  it("wrapInArray wraps a string in an array", () => {
    const result = wrapInArray("hi");
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toBe("hi");
  });

  it("wrapInArray wraps a number in an array", () => {
    const result = wrapInArray(7);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toBe(7);
  });

  // ---------------------------------------------------------------------------
  // 4. createElement — three-overload
  // ---------------------------------------------------------------------------

  // it('createElement returns the right element type', () => {
  //   const anchor = createElement('a')
  //   const div = createElement('div')
  //   const generic = createElement('span')
  //   expect(anchor).toBeInstanceOf(HTMLAnchorElement)
  //   expect(div).toBeInstanceOf(HTMLDivElement)
  //   expect(generic).toBeInstanceOf(HTMLElement)
  // })
});

// ---------------------------------------------------------------------------
// Type-level assertions
// ---------------------------------------------------------------------------

expectTypeOf<WrapReturn<string>>().toEqualTypeOf<string[]>();
expectTypeOf<WrapReturn<number>>().toEqualTypeOf<number[]>();

// overload call-site types
expectTypeOf(format("hi")).toEqualTypeOf<string>();
expectTypeOf(format(0)).toEqualTypeOf<string>();
expectTypeOf(parseValue("1")).toEqualTypeOf<number>();
expectTypeOf(parseValue(1)).toEqualTypeOf<string>();
