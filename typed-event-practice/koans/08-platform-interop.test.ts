import { EventEmitter } from "node:events";
import { describe, expect, it } from "vitest";

import { bindNodeStyle, TypedEventTarget } from "../src/adapters.js";
import { todo } from "../src/koan.js";

type DomLikeEvents = {
  message: { text: string };
};

type NodeTupleEvents = {
  message: [text: string, urgent: boolean];
};

describe("08 platform interop", () => {
  it("wraps EventTarget detail payloads with an event map", () => {
    const target = new TypedEventTarget<DomLikeEvents>();
    const seen: string[] = [];

    target.on("message", (payload) => {
      seen.push(payload.text);
    });

    target.emit("message", { text: "from target" });

    expect(seen).toEqual(["from target"]);
  });

  it("models Node-style emitters as tuple payload events", () => {
    const typed = bindNodeStyle<NodeTupleEvents>(new EventEmitter());
    const seen: string[] = [];

    typed.on("message", (text, urgent) => {
      seen.push(`${urgent ? "!" : "."}${text}`);
    });

    typed.emit("message", "hello", true);

    if (false) {
      // @ts-expect-error Node-style message events require both tuple arguments.
      typed.emit("message", "hello");
    }

    expect(seen).toEqual(["!hello"]);
  });
});
