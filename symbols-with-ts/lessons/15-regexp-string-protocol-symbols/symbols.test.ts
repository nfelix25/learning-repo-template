import { describe, expect, it } from "vitest";
import {
  createWordMatcher,
  runMatch,
  runReplace
} from "./symbols.js";

describe("Lesson 15: RegExp and string protocol symbols", () => {
  it("delegates match through Symbol.match", () => {
    const matcher = createWordMatcher("symbol");

    expect(runMatch("a symbol protocol", matcher)?.[0]).toBe("symbol");
    expect(runMatch("plain text", matcher)).toBeNull();
  });

  it("delegates replace through Symbol.replace", () => {
    const matcher = createWordMatcher("symbol");

    expect(runReplace("a symbol protocol", matcher, "hook")).toBe("a hook protocol");
  });

  it("supports direct string method delegation", () => {
    const matcher = createWordMatcher("symbol");

    expect("a symbol protocol".search(matcher as unknown as RegExp)).toBe(2);
    expect("a symbol protocol".split(matcher as unknown as RegExp)).toEqual(["a ", " protocol"]);
  });
});
