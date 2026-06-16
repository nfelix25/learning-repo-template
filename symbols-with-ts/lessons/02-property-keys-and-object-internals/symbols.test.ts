import { describe, expect, it } from "vitest";
import {
  classifyOwnKey,
  makeMixedKeyObject,
  readWithCoercedNumberKey
} from "./symbols.js";

describe("Lesson 02: Property keys and object internals", () => {
  it("classifies symbol keys separately from string keys", () => {
    expect(classifyOwnKey("name")).toBe("string");
    expect(classifyOwnKey(1)).toBe("string");
    expect(classifyOwnKey(Symbol("name"))).toBe("symbol");
  });

  it("shows that number-looking keys are string property keys", () => {
    const object = { "1": "one" };

    expect(readWithCoercedNumberKey(object, 1)).toBe("one");
  });

  it("keeps symbol keys separate from matching string descriptions", () => {
    const id = Symbol("id");
    const object = makeMixedKeyObject(id);

    expect(object.visible).toBe("string value");
    expect(object["42"]).toBe("number key value");
    expect(object[id]).toBe("symbol value");
    expect(Reflect.ownKeys(object)).toEqual(["42", "visible", id]);
  });
});
