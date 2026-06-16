import { describe, expect, it } from "vitest";
import {
  recommendDesign,
  reviewSymbolChoice,
  shouldUseSymbol
} from "./symbols.js";

describe("Lesson 23: Symbol design judgment", () => {
  it("recommends symbols for public collision-resistant protocols", () => {
    const scenario = { needsCollisionResistance: true, publicProtocol: true };

    expect(recommendDesign(scenario)).toBe("symbol");
    expect(shouldUseSymbol(scenario)).toBe(true);
  });

  it("recommends private fields for true privacy", () => {
    expect(recommendDesign({ truePrivacy: true })).toBe("private-field");
    expect(shouldUseSymbol({ truePrivacy: true })).toBe(false);
  });

  it("recommends WeakMap for object metadata side tables", () => {
    expect(recommendDesign({ metadataByObject: true })).toBe("weakmap");
  });

  it("recommends Node symbols only for Node platform hooks", () => {
    expect(recommendDesign({ nodeDebugHook: true })).toBe("node-symbol");
  });

  it("keeps ordinary public names simple", () => {
    expect(recommendDesign({ ordinaryPublicName: true })).toBe("string");
    expect(reviewSymbolChoice({ ordinaryPublicName: true })).toContain("string");
  });
});
