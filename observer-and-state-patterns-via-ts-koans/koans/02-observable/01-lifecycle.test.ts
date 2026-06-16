import { describe, it, assert } from "../helpers/koan.ts";
import { record, cleanupCounter } from "../helpers/recording.ts";
import { Observable } from "../../src/observable/observable.ts";

// Lesson: an Observable is a lazy producer plus a subscriber lifecycle.
//
// Inspect: src/observable/observable.ts and src/subscription.ts.
// Invariant: subscribing starts work; complete/error close the subscriber;
// teardown belongs to the subscription and must be idempotent.
describe("02-observable: lifecycle", () => {
  // Predict: construction describes work but must not run it.
  it("does not run the producer until subscribed", () => {
    let runs = 0;

    new Observable<number>((observer) => {
      runs += 1;
      observer.next(1);
    });

    assert.equal(runs, 0);
  });

  // Predict: a basic finite producer can send values and then complete once.
  it("delivers next values to a subscriber", () => {
    const events = record<number>();

    Observable.of(1, 2, 3).subscribe(events.observer);

    assert.deepEqual(events.values, [1, 2, 3]);
    assert.equal(events.completed, 1);
  });

  // Predict: after complete, the producer may keep calling methods, but the
  // subscriber should be closed to later values, errors, and duplicate complete.
  it("stops delivery after complete", () => {
    const events = record<number>();

    new Observable<number>((observer) => {
      observer.next(1);
      observer.complete();
      observer.next(2);
      observer.error(new Error("too late"));
      observer.complete();
    }).subscribe(events.observer);

    assert.deepEqual(events.values, [1]);
    assert.equal(events.errors.length, 0);
    assert.equal(events.completed, 1);
  });

  // Predict: unsubscribe can be called repeatedly, but the cleanup resource
  // should be released only once.
  it("runs teardown exactly once", () => {
    const cleanup = cleanupCounter();
    const subscription = new Observable<number>(() => cleanup.cleanup).subscribe(() => {});

    subscription.unsubscribe();
    subscription.unsubscribe();

    assert.equal(cleanup.count, 1);
  });

  // Predict: error is terminal just like complete, except it records failure
  // instead of successful completion.
  it("stops delivery after error", () => {
    const events = record<number>();
    const problem = new Error("boom");

    new Observable<number>((observer) => {
      observer.next(1);
      observer.error(problem);
      observer.next(2);
      observer.complete();
    }).subscribe(events.observer);

    assert.deepEqual(events.values, [1]);
    assert.deepEqual(events.errors, [problem]);
    assert.equal(events.completed, 0);
  });
});
