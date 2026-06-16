import { describe, it, assert } from "../helpers/koan.ts";
import { Subject } from "../../src/observer/subject.ts";

// Lesson: mutation during delivery is the first place a naive subject breaks.
//
// Inspect: src/observer/subject.ts.
// Invariant: each emission needs a deterministic delivery policy. A listener
// added during one emission should not unexpectedly join that same emission.
describe("01-observer: mutation during notification", () => {
  // Predict: the late subscriber should start observing with the next emission.
  // If it sees the current emission, the subject is iterating live mutable state.
  it("does not deliver the current emission to observers added mid-flight", () => {
    const subject = new Subject<number>();
    const values: string[] = [];

    subject.subscribe((value) => {
      values.push(`first:${value}`);
      subject.subscribe((nextValue) => values.push(`late:${nextValue}`));
    });
    subject.subscribe((value) => values.push(`second:${value}`));

    subject.next(1);
    subject.next(2);

    assert.deepEqual(values, [
      "first:1",
      "second:1",
      "first:2",
      "second:2",
      "late:2"
    ]);
  });

  // Predict: removing an observer during delivery should not make the current
  // pass skip or duplicate unrelated observers.
  it("keeps the current delivery order stable when an observer unsubscribes another observer", () => {
    const subject = new Subject<number>();
    const values: string[] = [];

    let second = subject.subscribe((value) => values.push(`second:${value}`));
    subject.subscribe((value) => {
      values.push(`first:${value}`);
      second.unsubscribe();
    });

    subject.next(1);
    subject.next(2);

    assert.deepEqual(values, ["second:1", "first:1", "first:2"]);
  });
});
