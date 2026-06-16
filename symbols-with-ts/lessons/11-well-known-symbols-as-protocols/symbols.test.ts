import { describe, expect, it } from "vitest";
import {
  createProtocolObject,
  getProtocolMethod,
  hasCallableProtocol,
  protocolNameFor
} from "./symbols.js";

describe("Lesson 11: Well-known symbols as protocols", () => {
  it("names well-known symbols with spec-style protocol names", () => {
    expect(protocolNameFor(Symbol.iterator)).toBe("@@iterator");
    expect(protocolNameFor(Symbol.toPrimitive)).toBe("@@toPrimitive");
    expect(protocolNameFor(Symbol.toStringTag)).toBe("@@toStringTag");
  });

  it("finds callable symbol-keyed protocol methods", () => {
    const value = createProtocolObject([1, 2, 3]);

    expect(hasCallableProtocol(value, Symbol.iterator)).toBe(true);
    expect(typeof getProtocolMethod(value, Symbol.iterator)).toBe("function");
    expect(hasCallableProtocol({ iterator: () => [] }, Symbol.iterator)).toBe(false);
  });

  it("lets built-in syntax discover the symbol protocol", () => {
    expect([...createProtocolObject([1, 2, 3]) as Iterable<number>]).toEqual([1, 2, 3]);
  });
});
