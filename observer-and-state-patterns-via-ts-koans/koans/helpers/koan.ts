import { describe, it } from "node:test";
import assert from "node:assert/strict";

export { assert, describe, it };

export function koan(name: string, run: () => void | Promise<void>): void {
  it(name, run);
}
