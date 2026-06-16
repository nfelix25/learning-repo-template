import { describe, expect, it } from "vitest";

import { TypedEmitter } from "../src/emitter.js";
import type { PrefixKeys } from "../src/event-map.js";
import { todo } from "../src/koan.js";

type UserLifecycleEvents = PrefixKeys<
  "user",
  {
    created: { id: string };
    deleted: { id: string; hard: boolean };
  }
>;

describe("06 derived events", () => {
  it("builds namespaced events with template literal types", () => {
    const emitter = new TypedEmitter<UserLifecycleEvents>();
    const observed: string[] = [];

    emitter.onAny((event) => {
      observed.push(String(event));
    });

    emitter.emit("user:created", { id: "u1" });
    emitter.emit("user:deleted", { id: "u1", hard: false });

    expect(observed).toEqual(["user:created", "user:deleted"]);
  });

  it("rejects unprefixed names and mismatched derived payloads", () => {
    const emitter = new TypedEmitter<UserLifecycleEvents>();

    if (false) {
      // @ts-expect-error the event key is user:created, not created.
      emitter.emit("created", { id: "u1" });

      // @ts-expect-error deleted payloads include the hard flag.
      emitter.emit("user:deleted", { id: "u1" });
    }

    expect(emitter.listenerCount("user:created")).toBe(0);
  });
});
