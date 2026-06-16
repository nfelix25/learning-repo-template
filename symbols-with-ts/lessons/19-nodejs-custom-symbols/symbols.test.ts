import { inspect } from "node:util";
import { describe, expect, it } from "vitest";
import {
  createInspectable,
  inspectToken,
  inspectValue,
  nodeCustomSymbols,
  promisifyToken
} from "./symbols.js";

describe("Lesson 19: Node.js custom symbols", () => {
  it("uses util.inspect.custom as a symbol-keyed debugging hook", () => {
    const value = createInspectable("record", "<record debug>");

    expect(Object.getOwnPropertySymbols(value)).toContain(inspect.custom);
    expect(inspectValue(value)).toBe("<record debug>");
  });

  it("keeps custom inspection separate from brand strings", () => {
    const value = createInspectable("record", "<record debug>");

    expect(Object.prototype.toString.call(value)).toBe("[object Object]");
    expect(inspectValue(value)).toBe("<record debug>");
  });

  it("recognizes Node platform symbols as symbols", () => {
    expect(inspectToken).toBe(inspect.custom);
    expect(typeof promisifyToken).toBe("symbol");
    expect(nodeCustomSymbols()).toEqual([inspect.custom, promisifyToken]);
  });
});
