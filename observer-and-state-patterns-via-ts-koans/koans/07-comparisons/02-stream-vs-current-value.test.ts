import { describe, it, assert } from "../helpers/koan.ts";
import { Observable } from "../../src/observable/observable.ts";
import { Subject } from "../../src/observer/subject.ts";
import { Store } from "../../src/state/store.ts";

// Lesson: streams answer "what happened"; stores answer "what is true now."
//
// Inspect: src/observer/subject.ts, src/observable/observable.ts, and src/state/store.ts.
// Invariant: event history and current value are separate policies.
describe("07-comparisons: event stream vs current value", () => {
  // Predict: without replay, the late subscriber sees only future events.
  it("event streams do not imply a readable current value", () => {
    const subject = new Subject<number>();
    const values: number[] = [];

    subject.next(1);
    subject.subscribe((value) => values.push(value));
    subject.next(2);

    assert.deepEqual(values, [2]);
  });

  // Predict: a store can answer immediately without waiting for a new event.
  it("current-value containers can be read without waiting for a new event", () => {
    const store = new Store("ready");

    assert.equal(store.get(), "ready");
  });

  // Predict: current-value behavior appears only because this adapter stores the
  // latest observed value in local state.
  it("an observable only has current-value behavior when an adapter stores one", () => {
    let current = 0;

    Observable.of(1, 2, 3).subscribe((value) => {
      current = value;
    });

    assert.equal(current, 3);
  });
});
