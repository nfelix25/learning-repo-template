import { describe, expect, it } from "vitest";
import {
  asyncDisposeToken,
  createAsyncResource,
  createSyncResource,
  disposeAsync,
  disposeSync,
  disposeToken
} from "./symbols.js";

describe("Lesson 20: Disposal symbols and modern protocols", () => {
  it("uses a symbol-keyed synchronous disposal method", () => {
    const log: string[] = [];
    const resource = createSyncResource(log, "file");

    expect(typeof resource[disposeToken]).toBe("function");
    disposeSync(resource);
    expect(log).toEqual(["dispose:file"]);
  });

  it("uses a symbol-keyed asynchronous disposal method", async () => {
    const log: string[] = [];
    const resource = createAsyncResource(log, "connection");

    expect(typeof resource[asyncDisposeToken]).toBe("function");
    await disposeAsync(resource);
    expect(log).toEqual(["asyncDispose:connection"]);
  });

  it("keeps sync and async disposal protocol keys separate", () => {
    expect(disposeToken).not.toBe(asyncDisposeToken);
  });
});
