import { describe, expect, expectTypeOf, it } from "vitest";
import {
  classifyPropertyKey,
  collectTyped,
  createTypedProtocol,
  renderTyped,
  typeToken,
  type TypedSymbolProtocol
} from "./symbols.js";

describe("Lesson 22: TypeScript notation for symbol-heavy JS", () => {
  it("keeps unique symbol notation tied to the exported token", () => {
    const token: typeof typeToken = typeToken;

    expectTypeOf<PropertyKey>().toEqualTypeOf<string | number | symbol>();
    expectTypeOf(token).toEqualTypeOf<typeof typeToken>();
  });

  it("implements a symbol-keyed typed protocol", () => {
    const value: TypedSymbolProtocol = createTypedProtocol("typed");

    expect(renderTyped(value)).toBe("typed");
    expect(value[typeToken]?.()).toBe("typed");
  });

  it("types and implements a well-known symbol method", () => {
    expect(collectTyped(createTypedProtocol("typed"))).toEqual(["typed"]);
  });

  it("uses PropertyKey as string | number | symbol", () => {
    expect(classifyPropertyKey("name")).toBe("string");
    expect(classifyPropertyKey(1)).toBe("number");
    expect(classifyPropertyKey(Symbol("name"))).toBe("symbol");
  });
});
