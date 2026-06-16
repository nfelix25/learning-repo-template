import { describe, expect, it } from "vitest";

import { TypedEmitter } from "../src/emitter.js";
import { todo } from "../src/koan.js";

type AppEvents = {
  connect: { userId: string };
  message: { text: string };
};

describe("02 basic typed emitter", () => {
  it("delivers a payload selected by the event name", () => {
    const emitter = new TypedEmitter<AppEvents>();
    const seen: string[] = [];

    emitter.on("message", (payload) => {
      seen.push(payload.text);
    });

    emitter.emit("message", { text: "hello" });

    expect(seen).toEqual(["hello"]);
  });

  it("rejects unknown event names and mismatched payloads at compile time", () => {
    const emitter = new TypedEmitter<AppEvents>();

    if (false) {
      // @ts-expect-error unknown events are not part of the event map.
      emitter.emit("disconnect", { userId: "u1" });

      // @ts-expect-error message payloads require text, not userId.
      emitter.emit("message", { userId: "u1" });
    }

    expect(emitter.listenerCount("message")).toBe(0);
  });
});
