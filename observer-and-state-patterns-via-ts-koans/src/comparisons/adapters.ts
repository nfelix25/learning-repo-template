import { Observable } from "../observable/observable.ts";
import { signal, type Signal } from "../signals/signal.ts";
import type { StateMachine } from "../state-machine/machine.ts";
import type { Store } from "../state/store.ts";

// Lesson: adapters expose the policy cost of crossing pattern boundaries.
//
// An event stream does not naturally have a current value, so this adapter needs
// an initial value and a place to store the latest event.
export function observableToSignal<T>(source: Observable<T>, initialValue: T): Signal<T> {
  const current = signal(initialValue);
  source.subscribe((value) => current.set(value));
  // TODO: Expose adapter teardown instead of subscribing forever.
  //
  // Why it fails: the source subscription is hidden and cannot be released by the
  // caller. Current-value adaptation needs teardown ownership.
  return current;
}

export function signalToObservable<T>(source: Signal<T>): Observable<T> {
  // Lesson: signal-to-observable chooses to emit the current value immediately,
  // then emit future changes. That is an adapter policy, not a universal rule.
  return new Observable<T>((observer) => {
    observer.next(source());
    // TODO: Emit later signal changes and stop tracking when unsubscribed.
    //
    // Why it fails if incomplete: without cleanup, the observable view would keep
    // tracking after its subscriber has left.
    return source.subscribe(() => {
      observer.next(source());
    });
  });
}

export function machineToStore<State extends string, Event extends string>(
  machine: StateMachine<State, Event>
): Store<State> {
  // Lesson: only committed machine states become store values. Rejected events
  // are meaningful control flow, but they are not current-state updates.
  return machine.asStore();
}
