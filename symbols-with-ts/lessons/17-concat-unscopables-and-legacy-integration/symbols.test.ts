import { describe, expect, it } from "vitest";
import {
  concatWithPair,
  createSpreadablePair,
  getArrayUnscopables
} from "./symbols.js";

describe("Lesson 17: Concat, unscopables, and legacy integration", () => {
  it("marks an array-like object as concat spreadable", () => {
    const pair = createSpreadablePair("a", "b");

    expect(pair[Symbol.isConcatSpreadable]).toBe(true);
    expect(concatWithPair("start", pair)).toEqual(["start", "a", "b"]);
  });

  it("contrasts spreadable and non-spreadable array-like objects", () => {
    const ordinary = { 0: "a", 1: "b", length: 2 };

    expect(["start"].concat(ordinary as never)).toEqual(["start", ordinary]);
  });

  it("reads Array unscopables without using a with statement", () => {
    const unscopables = getArrayUnscopables();

    expect(unscopables.includes).toBe(true);
    expect(unscopables.find).toBe(true);
  });
});
