import { describe, expect, it } from "vitest";
import {
  BrandedThing,
  isLesson16Instance,
  mapWithSpecies,
  PlainSpeciesArray
} from "./symbols.js";

describe("Lesson 16: Instanceof, species, and constructor hooks", () => {
  it("customizes instanceof with Symbol.hasInstance", () => {
    expect({ brand: "lesson-16" } instanceof BrandedThing).toBe(true);
    expect(isLesson16Instance({ brand: "lesson-16" })).toBe(true);
    expect(isLesson16Instance({ brand: "other" })).toBe(false);
  });

  it("uses Symbol.species to choose derived constructor results", () => {
    const values = new PlainSpeciesArray(1, 2, 3);
    const mapped = mapWithSpecies(values);

    expect(mapped).toEqual([2, 4, 6]);
    expect(mapped).toBeInstanceOf(Array);
    expect(mapped).not.toBeInstanceOf(PlainSpeciesArray);
  });
});
