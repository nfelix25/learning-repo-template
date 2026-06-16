import { describe, expect, it } from "vitest";
import {
  brandOf,
  createSpoofedArrayBrand,
  createTaggedObject,
  isSpoofedArray
} from "./symbols.js";

describe("Lesson 18: ToStringTag, branding, and introspection", () => {
  it("reads built-in brand strings", () => {
    expect(brandOf(new Map())).toBe("[object Map]");
    expect(brandOf([])).toBe("[object Array]");
  });

  it("customizes brand strings with Symbol.toStringTag", () => {
    expect(brandOf(createTaggedObject("Queue"))).toBe("[object Queue]");
  });

  it("shows why brand strings can be spoofed", () => {
    const spoofed = createSpoofedArrayBrand();

    expect(brandOf(spoofed)).toBe("[object Array]");
    expect(Array.isArray(spoofed)).toBe(false);
    expect(isSpoofedArray(spoofed)).toBe(true);
  });
});
