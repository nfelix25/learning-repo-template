import { describe, expect, it } from "vitest";

import type { EventUnion, PayloadOf } from "../src/event-map.js";
import { expectType, todo } from "../src/koan.js";

type AppEvents = {
  connect: { userId: string };
  disconnect: { userId: string; reason: "manual" | "timeout" };
  message: { text: string };
};

describe("01 event map shapes", () => {
  it("connects event keys to payload shapes", () => {
    const connectPayload: PayloadOf<AppEvents, "connect"> = { userId: "u1" };

    expectType<{ userId: string }>(connectPayload);

    if (false) {
      // @ts-expect-error connect payloads do not have message text.
      const invalidPayload: PayloadOf<AppEvents, "connect"> = { text: "hello" };
      expect(invalidPayload).toEqual({});
    }

    expect(connectPayload.userId).toBe("u1");
  });

  it("can project an event map into a discriminated union", () => {
    const event: EventUnion<AppEvents> = {
      type: "message",
      payload: { text: "hello" },
    };

    if (event.type === "message") {
      expect(event.payload.text).toBe("hello");
    }
  });
});
