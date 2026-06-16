import { describe, expect, it } from "vitest";
import {
  collectAsync,
  createAsyncRange,
  hasAsyncIterator
} from "./symbols.js";

describe("Lesson 13: Async iteration protocol", () => {
  it("creates an async iterable", () => {
    const range = createAsyncRange(1, 3);

    expect(hasAsyncIterator(range)).toBe(true);
  });

  it("collects async values with for-await-of", async () => {
    await expect(collectAsync(createAsyncRange(2, 4))).resolves.toEqual([2, 3, 4]);
  });

  it("keeps sync and async protocol keys distinct", () => {
    const range = createAsyncRange(1, 1) as object;

    expect(Symbol.iterator in range).toBe(false);
    expect(Symbol.asyncIterator in range).toBe(true);
  });
});
