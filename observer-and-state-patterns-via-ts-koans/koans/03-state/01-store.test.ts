import { describe, it, assert } from "../helpers/koan.ts";
import { Store } from "../../src/state/store.ts";

// Lesson: stores answer "what is true now?"
//
// Inspect: src/state/store.ts.
// Invariant: reads are synchronous, writes update current state, and
// subscriptions observe future committed changes until unsubscribed.
describe("03-state: store fundamentals", () => {
  // Predict: a store can be read immediately after construction.
  it("exposes current state synchronously", () => {
    const store = new Store({ count: 0 });

    assert.deepEqual(store.get(), { count: 0 });
  });

  // Predict: subscribers see each committed write in order.
  it("notifies subscribers when state changes", () => {
    const store = new Store(0);
    const values: number[] = [];

    store.subscribe((state) => values.push(state));
    store.set(1);
    store.set(2);

    assert.deepEqual(values, [1, 2]);
  });

  // Predict: unsubscription is part of store correctness, just as it was for
  // observer notification.
  it("does not notify an unsubscribed listener", () => {
    const store = new Store(0);
    const values: number[] = [];
    const subscription = store.subscribe((state) => values.push(state));

    store.set(1);
    subscription.unsubscribe();
    store.set(2);

    assert.deepEqual(values, [1]);
  });
});
