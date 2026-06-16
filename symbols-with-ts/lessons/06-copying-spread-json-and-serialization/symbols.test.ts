import { describe, expect, it } from "vitest";
import {
  copiedSymbol,
  copyWithAssign,
  copyWithSpread,
  createCopyFixture,
  hiddenSymbol,
  serializeForJson
} from "./symbols.js";

describe("Lesson 06: Copying, spread, JSON, and serialization", () => {
  it("sets up enumerable and non-enumerable symbol properties", () => {
    const fixture = createCopyFixture();

    expect(Object.getOwnPropertyDescriptor(fixture, copiedSymbol)?.enumerable).toBe(true);
    expect(Object.getOwnPropertyDescriptor(fixture, hiddenSymbol)?.enumerable).toBe(false);
  });

  it("copies enumerable own symbol keys with Object.assign", () => {
    const copy = copyWithAssign(createCopyFixture());

    expect(copy[copiedSymbol]).toBe("copied symbol value");
    expect(copy[hiddenSymbol]).toBeUndefined();
  });

  it("copies enumerable own symbol keys with object spread", () => {
    const copy = copyWithSpread(createCopyFixture());

    expect(copy[copiedSymbol]).toBe("copied symbol value");
    expect(copy[hiddenSymbol]).toBeUndefined();
  });

  it("drops symbol keys and symbol values during JSON serialization", () => {
    expect(serializeForJson(createCopyFixture())).toBe("{\"name\":\"source\"}");
  });
});
