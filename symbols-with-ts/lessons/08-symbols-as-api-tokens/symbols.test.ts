import { describe, expect, it } from "vitest";
import {
  createRenderable,
  discoverSymbolKeys,
  renderIfSupported,
  renderToken
} from "./symbols.js";

describe("Lesson 08: Symbols as API tokens", () => {
  it("creates a symbol-keyed protocol implementation", () => {
    const value = createRenderable("card", "<card />");

    expect(value.name).toBe("card");
    expect(value[renderToken]?.()).toBe("<card />");
    expect(Object.keys(value)).toEqual(["name"]);
  });

  it("renders only objects that implement the token", () => {
    const supported = createRenderable("card", "<card />");

    expect(renderIfSupported(supported)).toBe("<card />");
    expect(renderIfSupported({ name: "plain" })).toBe("unsupported");
  });

  it("shows that symbol-keyed protocols are reflectable", () => {
    expect(discoverSymbolKeys(createRenderable("card", "<card />"))).toEqual([renderToken]);
  });
});
