import { describe, expect, it } from "vitest";
import {
  createLocalPair,
  createRegisteredPair,
  isRegistered,
  registryKeyFor
} from "./symbols.js";

describe("Lesson 07: Global symbol registry and realms", () => {
  it("keeps local symbols fresh even with matching descriptions", () => {
    const [first, second] = createLocalPair("shared");

    expect(first).not.toBe(second);
    expect(first.description).toBe("shared");
    expect(registryKeyFor(first)).toBeUndefined();
    expect(isRegistered(first)).toBe(false);
  });

  it("returns shared identity from the global registry", () => {
    const [first, second] = createRegisteredPair("lesson-07");

    expect(first).toBe(second);
    expect(registryKeyFor(first)).toBe("lesson-07");
    expect(isRegistered(first)).toBe(true);
  });
});
