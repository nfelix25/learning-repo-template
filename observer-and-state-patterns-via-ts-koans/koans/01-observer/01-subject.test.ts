import { describe, it, assert } from "../helpers/koan.ts";
import { Subject } from "../../src/observer/subject.ts";

// Lesson: a subject starts as "a list of callbacks", but the pattern becomes
// useful only when notification and subscription lifetime have clear rules.
//
// Inspect: src/observer/subject.ts and src/subscription.ts.
// Invariant: active observers receive each emission in subscription order, and
// an unsubscribed observer receives no later emissions.
describe("01-observer: subject fundamentals", () => {
  // Predict: after one emission, both observers should have seen the same value
  // in the order they subscribed.
  it("notifies active observers in subscription order", () => {
    const subject = new Subject<number>();
    const values: string[] = [];

    subject.subscribe((value) => values.push(`a:${value}`));
    subject.subscribe((value) => values.push(`b:${value}`));

    subject.next(1);

    assert.deepEqual(values, ["a:1", "b:1"]);
  });

  // Predict: unsubscribe should affect future emissions, not rewrite history.
  it("does not notify an observer after unsubscribe", () => {
    const subject = new Subject<number>();
    const values: number[] = [];

    const subscription = subject.subscribe((value) => values.push(value));
    subject.next(1);
    subscription.unsubscribe();
    subject.next(2);

    assert.deepEqual(values, [1]);
  });
});
