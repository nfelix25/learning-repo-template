import { describe, expect, it } from "vitest";
import {
  attachMetadata,
  canUseAsWeakMapKey,
  createMetadataTable,
  supportsSymbolWeakMapKeys,
  type SymbolAwareWeakMap
} from "./symbols.js";

function runtimeSupportsSymbolWeakMapKeys(): boolean {
  try {
    const key = Symbol("local");
    const table = new WeakMap<object, string>() as unknown as SymbolAwareWeakMap<string>;
    table.set(key, "ok");
    return table.get(key) === "ok";
  } catch {
    return false;
  }
}

const symbolWeakMapIt = runtimeSupportsSymbolWeakMapKeys() ? it : it.skip;

describe("Lesson 10: Symbols as WeakMap keys", () => {
  it("recognizes objects as weak keys", () => {
    const key = {};

    expect(canUseAsWeakMapKey(key)).toBe(true);
    expect(attachMetadata(createMetadataTable(), key, "object metadata")).toBe("object metadata");
  });

  symbolWeakMapIt("recognizes non-registered symbols as weak keys", () => {
    const key = Symbol("metadata");

    expect(supportsSymbolWeakMapKeys()).toBe(true);
    expect(canUseAsWeakMapKey(key)).toBe(true);
    expect(attachMetadata(createMetadataTable(), key, "symbol metadata")).toBe("symbol metadata");
  });

  symbolWeakMapIt("rejects registered symbols as weak keys", () => {
    const key = Symbol.for("metadata");

    expect(canUseAsWeakMapKey(key)).toBe(false);
  });
});
