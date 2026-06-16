import { describe, expect, it } from "vitest";
import {
  createPluginHost,
  extensionPoint,
  getExtensionDescriptor
} from "./symbols.js";

describe("Lesson 04: Symbol-keyed properties", () => {
  it("defines and calls a symbol-keyed extension method", () => {
    const host = createPluginHost("ready");

    expect(host.name).toBe("host");
    expect(host[extensionPoint]?.()).toBe("ready");
  });

  it("keeps the extension point out of string-key enumeration", () => {
    const host = createPluginHost("ready");

    expect(Object.keys(host)).toEqual(["name"]);
    expect(Object.getOwnPropertySymbols(host)).toEqual([extensionPoint]);
  });

  it("uses normal property descriptors for symbol keys", () => {
    const host = createPluginHost("ready");
    const descriptor = getExtensionDescriptor(host);

    expect(descriptor?.enumerable).toBe(false);
    expect(descriptor?.configurable).toBe(true);
    expect(typeof descriptor?.value).toBe("function");
  });
});
