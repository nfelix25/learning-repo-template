import { describe, expect, it } from "vitest";

import { TypedEmitter } from "../src/emitter.js";
import { todo } from "../src/koan.js";

type AppEvents = {
  message: { text: string };
};

describe("03 listener lifecycle", () => {
  it("supports off and once", () => {
    const emitter = new TypedEmitter<AppEvents>();
    const seen: string[] = [];
    const persistent = (payload: AppEvents["message"]) => {
      seen.push(`on:${payload.text}`);
    };

    emitter.once("message", (payload) => {
      seen.push(`once:${payload.text}`);
    });
    emitter.on("message", persistent);

    emitter.emit("message", { text: "first" });
    emitter.off("message", persistent);
    emitter.emit("message", { text: "second" });

    expect(seen).toEqual(["once:first", "on:first"]);
  });

  it("uses a listener snapshot while an emit is in progress", () => {
    const emitter = new TypedEmitter<AppEvents>();
    const calls: string[] = [];
    let addedThird = false;

    const second = () => {
      calls.push("second");
    };

    const third = () => {
      calls.push("third");
    };

    const first = () => {
      calls.push("first");
      emitter.off("message", second);

      if (!addedThird) {
        addedThird = true;
        emitter.on("message", third);
      }
    };

    emitter.on("message", first);
    emitter.on("message", second);

    emitter.emit("message", { text: "one" });
    emitter.emit("message", { text: "two" });

    expect(calls).toEqual(["first", "second", "first", "third"]);
  });
});
