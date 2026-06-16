import { describe, expect, it } from "vitest";
import {
  collectWithForOf,
  createRange,
  firstTwo,
  isReusable
} from "./symbols.js";

describe("Lesson 12: Iteration protocol", () => {
  it("creates a reusable range iterable", () => {
    const range = createRange(2, 4);

    expect([...range]).toEqual([2, 3, 4]);
    expect(isReusable(range)).toBe(true);
  });

  it("supports for-of consumption", () => {
    expect(collectWithForOf(createRange(1, 3))).toEqual([1, 2, 3]);
  });

  it("supports destructuring through the iterator protocol", () => {
    expect(firstTwo(createRange(5, 8))).toEqual([5, 6]);
  });
});
