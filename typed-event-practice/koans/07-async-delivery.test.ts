import { describe, expect, it } from "vitest";

import { TypedEmitter } from "../src/emitter.js";
import { todo } from "../src/koan.js";
import { emitScheduled } from "../src/scheduling.js";

type AppEvents = {
  message: { text: string };
};

describe("07 async delivery", () => {
  it("shows how microtask delivery changes observable ordering", async () => {
    const emitter = new TypedEmitter<AppEvents>();
    const order: string[] = [];

    emitter.on("message", () => {
      order.push("listener");
    });

    const delivered = emitScheduled(emitter, "microtask", "message", {
      text: "hello",
    });
    order.push("after schedule");

    await delivered;

    expect(order).toEqual(["after schedule", "listener"]);
  });

  it("keeps scheduled emits tied to the event map", () => {
    const emitter = new TypedEmitter<AppEvents>();

    if (false) {
      // @ts-expect-error message payloads require text.
      emitScheduled(emitter, "microtask", "message", { userId: "u1" });
    }

    expect(emitter.listenerCount("message")).toBe(0);
  });
});
