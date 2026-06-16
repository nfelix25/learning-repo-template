import { describe, expect, it } from "vitest";
import {
  createSymbolTarget,
  createTransparentProxy,
  listForwardedKeys,
  proxyHook
} from "./symbols.js";

describe("Lesson 21: Symbols with proxies and Reflect", () => {
  it("creates a symbol-bearing target", () => {
    const target = createSymbolTarget("wrapped", "ok");

    expect(target.name).toBe("wrapped");
    expect(target[proxyHook]?.()).toBe("ok");
    expect(Reflect.ownKeys(target)).toEqual(["name", proxyHook]);
  });

  it("forwards symbol-keyed methods through a transparent proxy", () => {
    const proxy = createTransparentProxy(createSymbolTarget("wrapped", "ok"));

    expect(proxy[proxyHook]?.()).toBe("ok");
  });

  it("lists symbol keys without stringifying them", () => {
    const proxy = createTransparentProxy(createSymbolTarget("wrapped", "ok"));

    expect(listForwardedKeys(proxy)).toEqual(["name", proxyHook]);
  });
});
