import { describe, it, assert } from "../helpers/koan.ts";
import { signal } from "../../src/signals/signal.ts";
import { computed } from "../../src/signals/computed.ts";

// Lesson: dependency graphs are rebuilt as computations run.
//
// Inspect: src/signals/computed.ts, src/signals/signal.ts, and src/signals/runtime.ts.
// Invariant: each execution owns its latest dependency set, and nested tracking
// must restore the parent context after child reads.
describe("06-reactive-graph: dynamic dependencies", () => {
  // Predict: after the branch flips, writes to the old branch should no longer
  // invalidate the selected value.
  it("replaces stale dependencies after a conditional read changes", () => {
    const useFirst = signal(true);
    const first = signal("first");
    const second = signal("second");
    const selected = computed(() => (useFirst() ? first() : second()));

    assert.equal(selected(), "first");
    useFirst.set(false);
    assert.equal(selected(), "second");

    first.set("stale");
    assert.equal(selected(), "second");

    second.set("fresh");
    assert.equal(selected(), "fresh");
  });

  // Predict: reading a computed inside another computed should not lose the
  // outer computation's dependency on direct signal reads.
  it("restores parent tracking after nested computed reads", () => {
    const count = signal(1);
    const doubled = computed(() => count() * 2);
    const total = computed(() => doubled() + count());

    assert.equal(total(), 3);
    count.set(2);

    assert.equal(total(), 6);
  });
});
