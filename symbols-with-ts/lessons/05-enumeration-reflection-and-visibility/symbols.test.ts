import { describe, expect, it } from "vitest";
import {
  createVisibilityFixture,
  hiddenSymbol,
  summarizeKeys,
  visibleSymbol
} from "./symbols.js";

describe("Lesson 05: Enumeration, reflection, and visibility", () => {
  it("sets up every key visibility category", () => {
    const fixture = createVisibilityFixture();

    expect(Reflect.ownKeys(fixture)).toEqual([
      "visible",
      "hidden",
      visibleSymbol,
      hiddenSymbol
    ]);
  });

  it("summarizes which APIs see which keys", () => {
    const summary = summarizeKeys(createVisibilityFixture());

    expect(summary.objectKeys).toEqual(["visible"]);
    expect(summary.ownNames).toEqual(["visible", "hidden"]);
    expect(summary.ownSymbols).toEqual([visibleSymbol, hiddenSymbol]);
    expect(summary.reflectKeys).toEqual(["visible", "hidden", visibleSymbol, hiddenSymbol]);
    expect(summary.forInKeys).toEqual(["visible", "inherited"]);
  });
});
