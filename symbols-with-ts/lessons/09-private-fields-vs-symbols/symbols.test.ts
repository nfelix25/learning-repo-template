import { describe, expect, it } from "vitest";
import {
  inspectSymbolState,
  listInspectableKeys,
  PrivateCounter,
  SymbolCounter,
  symbolState
} from "./symbols.js";

describe("Lesson 09: Private fields vs symbols", () => {
  it("stores symbol state as an inspectable own property", () => {
    const counter = new SymbolCounter();

    counter.increment();

    expect(counter.value).toBe(1);
    expect(inspectSymbolState(counter)).toBe(1);
    expect(listInspectableKeys(counter)).toEqual([symbolState]);
  });

  it("keeps private fields out of property-key reflection", () => {
    const counter = new PrivateCounter();

    counter.increment();

    expect(counter.value).toBe(1);
    expect(listInspectableKeys(counter)).toEqual([]);
  });
});
