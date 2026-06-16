import { describe, it, assert } from "../helpers/koan.ts";
import { record } from "../helpers/recording.ts";
import { Observable } from "../../src/observable/observable.ts";
import { ManualScheduler, scheduledValues } from "../../src/observable/scheduler.ts";

// Lesson: scheduling separates production from delivery.
//
// Inspect: src/observable/scheduler.ts.
// Invariant: deferred delivery must still respect cancellation. A queued task is
// not permission to notify a closed subscriber later.
describe("02-observable: scheduling", () => {
  // Predict: synchronous notification happens in the current call stack.
  it("synchronous delivery happens before subscribe returns", () => {
    const events = record<number>();
    let receivedBeforeReturn = false;

    new Observable<number>((observer) => {
      observer.next(1);
    }).subscribe((value) => {
      events.next(value);
      receivedBeforeReturn = true;
    });

    assert.equal(receivedBeforeReturn, true);
    assert.deepEqual(events.values, [1]);
  });

  // Predict: scheduled values wait until the scheduler flushes.
  it("scheduled delivery waits for the scheduler to advance", () => {
    const scheduler = new ManualScheduler();
    const events = record<number>();

    scheduledValues([1, 2], scheduler).subscribe(events.observer);

    assert.deepEqual(events.values, []);

    scheduler.flush();

    assert.deepEqual(events.values, [1, 2]);
    assert.equal(events.completed, 1);
  });

  // Predict: unsubscribing before flush should cancel the pending notification
  // and completion.
  it("unsubscribe before scheduled delivery suppresses queued notifications", () => {
    const scheduler = new ManualScheduler();
    const events = record<number>();

    const subscription = scheduledValues([1], scheduler).subscribe(events.observer);
    subscription.unsubscribe();
    scheduler.flush();

    assert.deepEqual(events.values, []);
    assert.equal(events.completed, 0);
  });
});
