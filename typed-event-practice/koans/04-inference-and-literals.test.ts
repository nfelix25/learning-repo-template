import { describe, expect, it } from "vitest";

import { expectType, todo } from "../src/koan.js";

type AppEvents = {
  connect: { userId: string };
  disconnect: { userId: string; reason: "manual" | "timeout" };
  message: { text: string };
};

function definePayload<K extends keyof AppEvents, Payload extends AppEvents[K]>(
  event: K,
  payload: Payload,
) {
  return { event, payload };
}

describe("04 inference and literals", () => {
  it("preserves literal payload details while checking against the event map", () => {
    const eventNames = ["connect", "message"] as const satisfies ReadonlyArray<
      keyof AppEvents
    >;
    const disconnect = definePayload("disconnect", {
      userId: "u1",
      reason: "manual" as const,
    });

    expectType<"manual">(disconnect.payload.reason);
    expect(eventNames).toContain("connect");
    expect(disconnect.payload.reason).toBe("manual");
  });

  it("rejects payloads that do not satisfy the selected event", () => {
    if (false) {
      // @ts-expect-error disconnect requires a reason.
      definePayload("disconnect", { userId: "u1" });
    }

    expect(true).toBe(true);
  });
});
