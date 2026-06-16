import { describe, it, assert } from "../helpers/koan.ts";
import { Subject } from "../../src/observer/subject.ts";
import { Store } from "../../src/state/store.ts";
import { signal } from "../../src/signals/signal.ts";
import { computed } from "../../src/signals/computed.ts";

// Lesson: push, pull, and hybrid models answer different questions.
//
// Inspect: src/observer/subject.ts, src/state/store.ts, and src/signals/*.ts.
// Invariant: push delivers producer events; pull reads current value; signals
// often push invalidation and pull recomputation.
describe("07-comparisons: push, pull, and hybrid models", () => {
  // Predict: with push, nothing happens until the producer emits.
  it("push primitives deliver events because producers emit", () => {
    const subject = new Subject<number>();
    const values: number[] = [];

    subject.subscribe((value) => values.push(value));
    subject.next(1);

    assert.deepEqual(values, [1]);
  });

  // Predict: with pull, the consumer asks for the value now.
  it("pull primitives expose the current value on demand", () => {
    const store = new Store({ count: 1 });
    const count = signal(2);

    assert.deepEqual(store.get(), { count: 1 });
    assert.equal(count(), 2);
  });

  // Predict: changing a signal should invalidate the computed, while reading the
  // computed pulls the repaired value.
  it("computed values push invalidation and pull recomputation", () => {
    const count = signal(1);
    const doubled = computed(() => count() * 2);

    assert.equal(doubled(), 2);
    count.set(2);

    assert.equal(doubled(), 4);
  });
});
