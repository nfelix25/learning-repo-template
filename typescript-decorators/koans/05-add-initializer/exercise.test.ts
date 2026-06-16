import assert from "node:assert/strict";
import test from "node:test";

import { createBoundButton } from "./exercise.js";

test("addInitializer can bind a method during instance initialization", () => {
  const result = createBoundButton();

  assert.equal(result.result, "Save");
  assert.deepEqual(result.events, [
    "decorate:click",
    "class defined",
    "initializer:click",
    "click:Save",
  ]);
});
