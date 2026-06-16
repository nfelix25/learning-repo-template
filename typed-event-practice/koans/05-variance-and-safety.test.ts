import { describe, expect, it } from "vitest";

import { TypedEmitter } from "../src/emitter.js";
import { todo } from "../src/koan.js";

type SelectionEvents = {
  selected: { id: string; kind: "user" | "team" };
};

describe("05 variance and listener safety", () => {
  it("accepts listeners that can handle every payload for an event", () => {
    const emitter = new TypedEmitter<SelectionEvents>();
    const seen: string[] = [];

    const safeListener = (payload: SelectionEvents["selected"]) => {
      seen.push(payload.kind);
    };

    emitter.on("selected", safeListener);
    emitter.emit("selected", { id: "t1", kind: "team" });

    expect(seen).toEqual(["team"]);
  });

  it("rejects listeners that require a narrower payload than the event promises", () => {
    const emitter = new TypedEmitter<SelectionEvents>();
    const onlyUser = (payload: {
      id: string;
      kind: "user";
      admin: boolean;
    }) => {
      expect(payload.admin).toBe(true);
    };

    if (false) {
      // @ts-expect-error selected can emit a team payload, so this listener is too narrow.
      emitter.on("selected", onlyUser);
    }

    expect(emitter.listenerCount("selected")).toBe(0);
  });
});
