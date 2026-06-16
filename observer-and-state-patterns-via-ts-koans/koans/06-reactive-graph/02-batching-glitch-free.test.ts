import { describe, it, assert } from "../helpers/koan.ts";
import { signal } from "../../src/signals/signal.ts";
import { computed } from "../../src/signals/computed.ts";
import { effect } from "../../src/signals/effect.ts";
import { batch } from "../../src/signals/runtime.ts";

// Lesson: propagation must be both efficient and consistent.
//
// Inspect: src/signals/runtime.ts and src/signals/computed.ts.
// Invariant: a batch represents one logical update, and diamond graphs must not
// expose a mix of stale and fresh derived values.
//
// Diamond:
//   count -> doubled  -> total
//         -> tripled  -> total
describe("06-reactive-graph: batching and glitch freedom", () => {
  // Predict: two writes inside one batch should lead to one final effect run.
  it("coalesces effect reruns after a batch", () => {
    const first = signal(1);
    const second = signal(10);
    const total = computed(() => first() + second());
    const observed: number[] = [];

    effect(() => {
      observed.push(total());
    });
    batch(() => {
      first.set(2);
      second.set(20);
    });

    assert.deepEqual(observed, [11, 22]);
  });

  // Predict: total should see the updated doubled and updated tripled together.
  it("keeps diamond dependencies consistent", () => {
    const count = signal(1);
    const doubled = computed(() => count() * 2);
    const tripled = computed(() => count() * 3);
    const total = computed(() => doubled() + tripled());

    assert.equal(total(), 5);
    count.set(2);

    assert.equal(total(), 10);
  });

  // Predict: multiple invalidation paths should not force duplicate recompute
  // work for the same final read.
  it("avoids duplicate recomputation through multiple invalidation paths", () => {
    const count = signal(1);
    const doubled = computed(() => count() * 2);
    const tripled = computed(() => count() * 3);
    const total = computed(() => doubled() + tripled());

    total();
    count.set(2);
    total();

    assert.equal(total.computeCount, 2);
  });
});
