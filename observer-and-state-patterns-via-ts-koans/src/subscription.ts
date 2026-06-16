export interface Subscription {
  readonly closed: boolean;
  unsubscribe(): void;
}

export type Teardown = void | (() => void) | Subscription;

// Lesson: a Subscription is a lifetime boundary.
//
// The koans use this small class to make one guarantee visible: ending a
// subscription must be idempotent. The first unsubscribe owns cleanup; later
// unsubscribe calls should be harmless.
export class BasicSubscription implements Subscription {
  closed = false;
  private teardown: Teardown;

  constructor(teardown?: Teardown) {
    this.teardown = teardown;
  }

  unsubscribe(): void {
    if (this.closed) {
      return;
    }

    this.closed = true;

    // Pressure point: teardown can be a function or another subscription. Both
    // represent resources that must be released exactly once.
    if (typeof this.teardown === "function") {
      this.teardown();
    } else if (this.teardown) {
      this.teardown.unsubscribe();
    }
  }
}

export function combineSubscriptions(subscriptions: Subscription[]): Subscription {
  // Lesson: operators often create more than one subscription. Combining them
  // gives the outer subscription one place to release all owned work.
  return new BasicSubscription(() => {
    for (const subscription of subscriptions) {
      subscription.unsubscribe();
    }
  });
}
