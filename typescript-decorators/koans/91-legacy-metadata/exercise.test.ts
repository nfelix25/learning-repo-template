import assert from "node:assert/strict";
import test from "node:test";

import { inspectLegacyMetadata } from "./exercise.js";

test("legacy emitDecoratorMetadata exposes design metadata through reflect-metadata", () => {
  assert.deepEqual(inspectLegacyMetadata(), [
    "params:String,Number",
    "return:Boolean",
  ]);
});
