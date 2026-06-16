import { describe, it, assert } from "../helpers/koan.ts";
import { signal } from "../../src/signals/signal.ts";
import { computed } from "../../src/signals/computed.ts";
import { effect } from "../../src/signals/effect.ts";

// Lesson: a reactive runtime needs safety boundaries.
//
// Inspect: src/signals/runtime.ts, src/signals/computed.ts, and src/signals/effect.ts.
// Invariant: cycles and self-updates must be rejected or bounded
// deterministically, never left to accidental stack overflow.
describe("06-reactive-graph: cycles and reentrancy", () => {
  // Predict: the runtime should report a cycle with its own error, not recurse
  // until the JavaScript stack fails.
  it("detects computed cycles deterministically", () => {
    let a: ReturnType<typeof computed<number>>;
    const b = computed(() => a() + 1);
    a = computed(() => b() + 1);

    assert.throws(() => a(), /cycle/i);
  });

  // Predict: an effect can cause more work, but the runtime must bound the loop.
  it("bounds effect self-updates", () => {
    const count = signal(0);

    effect(() => {
      if (count() < 2) {
        count.set(count() + 1);
      }
    });

    assert.equal(count(), 2);
  });

  // Predict: writes during computed evaluation need a policy. This koan chooses
  // deterministic rejection.
  it("controls writes during computed evaluation", () => {
    const count = signal(0);
    const invalid = computed(() => {
      count.set(count() + 1);
      return count();
    });

    assert.throws(() => invalid(), /write during computation/i);
  });
});
