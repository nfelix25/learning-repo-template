import { Observable, type Operator } from "./observable.ts";
import { combineSubscriptions, type Subscription } from "../subscription.ts";

export function map<T, U>(project: (value: T) => U): Operator<T, U> {
  // Lesson: map changes values but should preserve the source lifecycle. Errors,
  // completion, and teardown still belong to the upstream subscription.
  return (source) =>
    new Observable<U>((observer) =>
      source.subscribe({
        next(value) {
          observer.next(project(value));
        },
        error(error) {
          observer.error(error);
        },
        complete() {
          observer.complete();
        }
      })
    );
}

export function filter<T>(predicate: (value: T) => boolean): Operator<T, T> {
  // Lesson: filter suppresses some `next` values. It must not suppress terminal
  // notifications, or subscribers would never know the source closed.
  return (source) =>
    new Observable<T>((observer) =>
      source.subscribe({
        next(value) {
          if (predicate(value)) {
            observer.next(value);
          }
        },
        error(error) {
          observer.error(error);
        },
        complete() {
          observer.complete();
        }
      })
    );
}

export function take<T>(count: number): Operator<T, T> {
  // Lesson: take is the first cancellation operator. It has to stop upstream
  // work after enough values, even when the source emits synchronously.
  return (source) =>
    new Observable<T>((observer) => {
      let seen = 0;
      let subscription: Subscription | undefined;
      subscription = source.subscribe({
        next(value) {
          if (seen >= count) {
            return;
          }

          seen += 1;
          observer.next(value);

          if (seen === count) {
            observer.complete();
            // TODO: This fails for synchronous sources because `subscription` is not assigned yet.
            //
            // Why it fails: synchronous producers can call `next` before
            // `source.subscribe` returns. The repair needs a subscription
            // ownership strategy that works during that reentrant window.
            subscription?.unsubscribe();
          }
        },
        error(error) {
          observer.error(error);
        },
        complete() {
          observer.complete();
        }
      });

      return subscription;
    });
}

export function switchMap<T, U>(project: (value: T) => Observable<U>): Operator<T, U> {
  // Lesson: switchMap owns two lifetimes: the outer source and the currently
  // active inner observable. New outer values cancel stale inner work.
  return (source) =>
    new Observable<U>((observer) => {
      const subscriptions: Subscription[] = [];

      const outer = source.subscribe({
        next(value) {
          // TODO: Cancel the previous inner subscription before starting the next one.
          //
          // Why it fails: every inner subscription stays alive, so stale work can
          // keep producing values and holding resources after it is no longer the
          // selected inner stream.
          const inner = project(value).subscribe({
            next(innerValue) {
              observer.next(innerValue);
            },
            error(error) {
              observer.error(error);
            },
            complete() {}
          });
          subscriptions.push(inner);
        },
        error(error) {
          observer.error(error);
        },
        complete() {
          observer.complete();
        }
      });

      return combineSubscriptions([outer, ...subscriptions]);
    });
}
