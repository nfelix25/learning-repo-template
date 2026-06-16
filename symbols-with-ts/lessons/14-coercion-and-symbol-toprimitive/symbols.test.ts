import { describe, expect, it } from "vitest";
import {
  createCoercibleValue,
  defaultAddition,
  numberFrom,
  stringFrom,
  type PrimitiveHint
} from "./symbols.js";

describe("Lesson 14: Coercion and Symbol.toPrimitive", () => {
  it("uses the number hint for numeric conversion", () => {
    const log: PrimitiveHint[] = [];

    expect(numberFrom(createCoercibleValue(log))).toBe(7);
    expect(log).toEqual(["number"]);
  });

  it("uses the string hint for string conversion", () => {
    const log: PrimitiveHint[] = [];

    expect(stringFrom(createCoercibleValue(log))).toBe("value:7");
    expect(log).toEqual(["string"]);
  });

  it("uses the default hint for addition", () => {
    const log: PrimitiveHint[] = [];

    expect(defaultAddition(createCoercibleValue(log))).toBe("default:7!");
    expect(log).toEqual(["default"]);
  });
});
